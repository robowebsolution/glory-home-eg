import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface ProjectItem { id?: number; name_en: string; name_ar: string; images?: string[]; cover?: string | null }

interface ProjectCardProps {
  project: ProjectItem;
  onEdit: (project: ProjectItem) => void;
  onDelete: (id: number | string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const cover = project.cover || (project.images && project.images.length > 0 ? project.images[0] : null);

  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden group">
      <div className="relative w-full h-48 bg-muted">
        {cover ? (
          <img src={cover} alt={project.name_en} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-semibold truncate">{project.name_ar || project.name_en}</h3>
        <p className="text-sm text-muted-foreground truncate">{project.name_en}</p>
        <div className="flex justify-end gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
            <Pencil className="h-4 w-4 mr-1" /> تعديل
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(project.id!)}>
            <Trash2 className="h-4 w-4 mr-1" /> حذف
          </Button>
        </div>
      </div>
    </div>
  );
}
