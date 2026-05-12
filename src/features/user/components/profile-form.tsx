import { useForm } from "react-hook-form";
import z from "zod/v3";
import { UserProfileSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useImageUpload } from "@/hooks/use-upload";
import { useDropzone } from "react-dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/ui/loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useSession } from "../query";

interface ProfileFormProps {
  isDisabled?: boolean;
  onSubmit: (data: z.infer<typeof UserProfileSchema>) => void;
  onDelete: () => void;
  defaultValues?: z.infer<typeof UserProfileSchema>;
  onClose?: () => void;
}

export default function ProfileForm({
  isDisabled,
  onSubmit,
  onDelete,
  defaultValues,
  onClose,
}: ProfileFormProps) {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues,
  });

  const currentImage = form.watch("image");

  const initialImages = useMemo(
    () => (currentImage ? [currentImage] : []),
    [currentImage],
  );

  const { uploadImages, uploading } = useImageUpload({
    maxImages: 1,
    initialImages,
    onSuccess: (urls) => {
      if (urls.length > 0) {
        form.setValue("image", urls[0]);
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: uploadImages,
    accept: { "image/*": [] },
    maxSize: 10 * 1024 * 1024,
    disabled: uploading,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center gap-5">
                  <div
                    className="size-32 rounded-full overflow-hidden cursor-pointer hover:opacity-75 transition-all relative"
                    {...getRootProps()}
                  >
                    {field.value ? (
                      <>
                        <img
                          src={field.value}
                          alt="Profile image"
                          className="size-full object-cover"
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader />
                          </div>
                        )}
                      </>
                    ) : (
                      <Avatar className="size-32 rounded-full hover:bg-gray-50 transition-colors">
                        <AvatarFallback>
                          {uploading ? (
                            <Loader className="border-neutral-400 border-t-transparent" />
                          ) : (
                            <ImageIcon className="size-9 text-neutral-400" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 -ml-2"
                      onClick={() => form.setValue("image", "")}
                      disabled={isDisabled || uploading}
                    >
                      이미지 제거
                    </Button>
                  )}
                </div>

                <input
                  {...getInputProps()}
                  className="sr-only"
                  disabled={uploading || isDisabled}
                />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="이름을 입력하세요"
                  className="h-11 bg-muted/50 border-none focus-visible:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-1">
          <FormLabel className="text-sm font-semibold">이메일</FormLabel>
          <div className="h-11 flex items-center px-3 bg-muted/30 rounded-md text-muted-foreground text-sm border border-dashed">
            {session?.email}
          </div>
          <p className="text-[10px] text-muted-foreground px-1 pt-1">
            이메일은 변경할 수 없습니다.
          </p>
        </div>

        <Separator className="my-6 opacity-50" />

        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            계정을 삭제하면 모든 프로젝트 데이터와 활동 내역이 영구적으로
            삭제됩니다.
          </p>
          <Button
            type="button"
            variant="ghost"
            className="w-full h-9 text-destructive hover:bg-destructive/10 hover:text-destructive border border-destructive/20"
            onClick={onDelete}
          >
            계정 삭제
          </Button>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isDisabled}
          >
            취소
          </Button>

          <Button type="submit" size="md" disabled={isDisabled || uploading}>
            수정
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
