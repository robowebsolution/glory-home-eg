'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
export const AboutCeo = () => {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      name: 'Merna Magdy',
      title: 'Co-founder of Glory Home Furniture |',
      bio: 'As a co-founder of Glory Home Furniture, I have been leading the company for over eight years, overseeing its growth and development. My background in pharmacy and pharmaceutical sciences has given me a unique perspective on product design and quality control, which I apply to our furniture products. I am passionate about creating comfortable and sustainable living spaces that enhance the well-being of our customers. I also have strong management skills, having successfully led a team of professionals to achieve our business goals. I am always looking for new opportunities to innovate and improve our products and services.',
      alt: 'Merna Magdy, Co-founder of Glory Home Furniture'
    },
    ar: {
      name: 'ميرنا مجدي',
      title: 'الشريك المؤسس لشركة جلوري هوم للأثاث |',
      bio: 'بصفتي شريكًا مؤسسًا في جلوري هوم للأثاث، أقود الشركة منذ أكثر من ثماني سنوات، حيث أشرف على نموها وتطورها. خلفيتي في الصيدلة والعلوم الصيدلانية منحتني منظورًا فريدًا في تصميم المنتجات ومراقبة الجودة، وهو ما أطبقه على منتجات الأثاث لدينا. أنا شغوفة بإنشاء مساحات معيشة مريحة ومستدامة تعزز رفاهية عملائنا. كما أمتلك مهارات إدارية قوية، حيث نجحت في قيادة فريق من المحترفين لتحقيق أهداف عملنا. أبحث دائمًا عن فرص جديدة للابتكار وتحسين منتجاتنا وخدماتنا.',
      alt: 'ميرنا مجدي، الشريك المؤسس لشركة جلوري هوم للأثاث'
    }
  };

  const texts = content[language];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative h-96 w-full lg:h-[500px] rounded-lg shadow-2xl overflow-hidden">
              <Image
                src="/merna.webp"
                alt={texts.alt}
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
                
              />
            </div>
          </motion.div>
          <motion.div 
            className="mt-12 lg:mt-0"
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              {texts.name}
            </h2>
            <p className="mt-3 text-lg text-indigo-600 dark:text-indigo-400 font-semibold">
              {texts.title}
            </p>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              {texts.bio}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
