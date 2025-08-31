// Client-side API functions with proper error handling
import { supabase, isSupabaseConfigured, supabaseConfig } from "@/lib/supabase-client"

// تعديل دالة جلب الفئات لدعم التخزين المؤقت
export async function fetchCategories() {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured() || !supabase) {
      console.error("Supabase not configured:", supabaseConfig)
      return []
    }

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name")
      

    console.log("Raw response from Supabase:", { categories, error })

    if (error) {
      console.error("Supabase error fetching categories:", error)
      return []
    }

    if (!categories || categories.length === 0) {
      console.warn("No categories returned from Supabase.")
    }

    console.log("Categories fetched successfully:", categories?.length || 0)
    return categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    console.error("Supabase config:", supabaseConfig)
    return []
  }
}

export async function fetchProducts(params?: {
  category?: string
  featured?: boolean
  limit?: number
}) {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured() || !supabase) {
      console.error("Supabase not configured:", supabaseConfig)
      return []
    }

    console.log("Fetching products from Supabase with params:", params)
    // The foreign key is 'category_id', so Supabase will populate a 'categories' object.
    let query = supabase.from("products").select("*, categories(*)").eq("in_stock", true).order("created_at", { ascending: false })

    if (params?.category) {
      // We filter by the slug in the joined 'categories' table.
      query = query.eq("categories.slug", params.category)
    }

    if (params?.featured) {
      query = query.eq("featured", true)
    }

    if (params?.limit) {
      query = query.limit(params.limit)
    }

    const { data: products, error } = await query

    if (error) {
      console.error("Supabase error fetching products:", error)
      return []
    }

    console.log("Products fetched successfully:", products?.length || 0)

    // DEBUG: Log the first product to inspect its structure
    if (products && products.length > 0) {
      console.log("--- DEBUG: First Product Data ---");
      console.log(JSON.stringify(products[0], null, 2));
      console.log("--- END DEBUG ---");
    }
    return products || []
  } catch (error) {
    console.error("Error fetching products:", error)
    console.error("Supabase config:", supabaseConfig)
    return []
  }
}

// جلب كل الطلبات الخاصة بمستخدم معيّن
export async function getUserOrders(userId: string) {
  try {
    console.log("Fetching orders for user:", userId);
    if (!isSupabaseConfigured() || !supabase) {
      return [];
    }
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, items:order_items!order_items_order_id_fkey(*, product:products(name, name_ar, main_image, image_url))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
    console.log("Fetched orders:", orders);
    // ترتيب المنتجات داخل كل طلب حسب الاسم
    return (orders || []).map((order: any) => ({
      ...order,
      items: (order.items || []).map((item: any) => ({
        ...item,
        product_name: (item.product?.name_ar || item.product?.name || "")
      }))
    }));
  } catch {
    return [];
  }
}

// إضافة منتج إلى الـ wishlist
export async function addToWishlist(userId: string, productId: string) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      // ✅ التصحيح: أرجع كائنًا يحتوي على success: false
      return { success: false, error: { message: "Supabase not configured" } };
    }

    // تحقق أولاً إذا كان المنتج موجود بالفعل
    const { data: exists, error: checkError } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();
      
    if (checkError) {
        // تعامل مع الخطأ أثناء التحقق
        throw checkError;
    }

    if (exists) {
      return { success: true, message: "Already in wishlist" }; // يمكن اعتبارها نجاحًا لأن المنتج بالفعل في القائمة
    }

    const { error } = await supabase
      .from("wishlist")
      .insert([{ user_id: userId, product_id: productId }]);

    if (error) {
      throw error; // ارمِ الخطأ ليتم التقاطه في catch
    }

    return { success: true };
  } catch (error: any) {
    console.error("API Error in addToWishlist:", error);
    return { success: false, error: { message: error.message || "An unknown error occurred" } };
  }
}

// إزالة منتج من الـ wishlist
export async function removeFromWishlist(userId: string, productId: string) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      // ✅ التصحيح: أرجع كائنًا يحتوي على success: false
      return { success: false, error: { message: "Supabase not configured" } };
    }

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      throw error; // ارمِ الخطأ ليتم التقاطه في catch
    }

    return { success: true };
  } catch (error: any) {
    console.error("API Error in removeFromWishlist:", error);
    return { success: false, error: { message: error.message || "An unknown error occurred" } };
  }
}

// دالة الشراء الآن (Buy Now)
export async function buyNowOrder({
  userId,
  name,
  phone,
  email,
  productId,
  quantity = 1,
  price
}: {
  userId: string,
  name: string,
  phone: string,
  email: string,
  productId: string,
  quantity?: number,
  price: number
}) {
  try {
    if (!isSupabaseConfigured() || !supabase) return { success: false, error: "not_configured" };
    // 1. أنشئ الطلب الرئيسي
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: userId,
        name,
        phone,
        email,
        total_amount: price * quantity,
        payment_status: "pending",
        status: "pending"
      }])
      .select()
      .single();
    if (orderError || !order) return { success: false, error: orderError };
    // 2. أضف العنصر للطلب
    const { error: itemError } = await supabase
      .from("order_items")
      .insert([{
        order_id: order.id,
        product_id: productId,
        quantity,
        price
      }]);
    if (itemError) return { success: false, error: itemError };
    return { success: true, orderId: order.id };
  } catch (error) {
    return { success: false, error };
  }
}

// Function to cancel an order
export async function cancelOrder(orderId: string) {
  try {
    if (!isSupabaseConfigured() || !supabase) return { success: false, error: "not_configured" };
    const { error } = await supabase
      .from("orders")
      .update({ status: "canceled" })
      .eq("id", orderId);
    if (error) return { success: false, error };
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

// Function to delete an order
export async function deleteOrder(orderId: string) {
  try {
    if (!isSupabaseConfigured() || !supabase) return { success: false, error: "not_configured" };
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);
    if (error) return { success: false, error };
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getUserWishlist(userId: string) {
  try {
    if (!isSupabaseConfigured() || !supabase) {
      return [];
    }
    const { data: wishlist, error } = await supabase
      .from("wishlist")
      .select("*, product:products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      return [];
    }
    // أرجع فقط المنتجات نفسها (مع بيانات المنتج)
    return (wishlist || []).map((item: any) => item.product).filter(Boolean);
  } catch {
    return [];
  }
}

export async function fetchCategory(slug: string) {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured() || !supabase) {
      console.error("Supabase not configured:", supabaseConfig)
      return null
    }


    const { data: category, error } = await supabase.from("categories").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Supabase error fetching category:", error)
      return null
    }

    console.log("Category fetched successfully:", category?.name)
    return category
  } catch (error) {
    console.error("Error fetching category:", error)
    console.error("Supabase config:", supabaseConfig)
    return null
  }
}
