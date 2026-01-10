import { Label } from "@/components/ui/label";

interface PhotoUploadProps {
  previewUrl: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PhotoUpload({ previewUrl, onFileChange }: PhotoUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="photo">Upload Photo</Label>
      <div className="flex flex-col gap-4">
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onFileChange}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90
            cursor-pointer"
        />
        {previewUrl && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
