import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";

import { WorkspaceFormSchema } from "../schema";
import { useImageUpload } from "@/hooks/use-upload";

interface WorkspaceFormProps {
  id?: string;
  isDisabled?: boolean;
  onSubmit: (data: z.infer<typeof WorkspaceFormSchema>) => void;
  defaultValues: z.infer<typeof WorkspaceFormSchema>;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function WorkspaceForm({
  id,
  isDisabled = false,
  onSubmit,
  defaultValues,
  onClose,
  isLoading = false,
}: WorkspaceFormProps) {
  const form = useForm<z.infer<typeof WorkspaceFormSchema>>({
    resolver: zodResolver(WorkspaceFormSchema),
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
      <form onSubmit={form.handleSubmit(onSubmit)} suppressHydrationWarning>
        <div className="flex flex-col gap-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>워크스페이스 이름</FormLabel>
                <FormControl>
                  <Input
                    placeholder="워크스페이스 이름을 입력하세요."
                    {...field}
                    disabled={isDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>워크스페이스 로고</FormLabel>
                <div className="flex items-center gap-5">
                  <div
                    className="size-[72px] rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-all relative"
                    {...getRootProps()}
                  >
                    {field.value ? (
                      <>
                        <img
                          src={field.value}
                          alt="Workspace logo"
                          className="w-full h-full object-cover"
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader />
                          </div>
                        )}
                      </>
                    ) : (
                      <Avatar className="rounded-md! size-[72px] hover:bg-gray-50 transition-colors">
                        <AvatarFallback className="rounded-md">
                          {uploading ? (
                            <Loader className="border-neutral-400 border-t-transparent" />
                          ) : (
                            <ImageIcon className="size-9 text-neutral-400" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">
                      {field.value
                        ? "이미지를 변경하려면 클릭하세요"
                        : "워크스페이스 로고를 등록하세요"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WEBP • 최대 10MB
                    </p>
                  </div>
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

        <Separator className="my-8" />

        <div className="flex justify-end gap-3">
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
            {id ? "수정하기" : "생성하기"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
