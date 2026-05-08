import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CircleAvatar from "@/components/ui/circle-avatar";
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/features/comment/query";
import { useSession } from "@/features/user/query";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";

interface CommentsSectionProps {
  taskId: string;
  open: boolean;
  onToggle: () => void;
  currentUserImage?: string;
  currentUserName?: string;
}

export default function CommentsSection({
  taskId,
  open,
  onToggle,
  currentUserImage,
  currentUserName,
}: CommentsSectionProps) {
  const { data: session } = useSession();
  const { data: comments = [], isLoading } = useComments(taskId);
  const { mutate: createComment, isPending: isCreating } = useCreateComment();
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(taskId);
  const { mutate: deleteComment } = useDeleteComment(taskId);
  const [ConfirmDialog, confirm] = useConfirm(
    "정말로 이 댓글을 삭제하시겠습니까?",
    "삭제된 댓글은 복구할 수 없습니다.",
  );

  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  function handleCreate() {
    if (!content.trim()) return;
    createComment(
      { taskId, content },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  }

  function handleUpdate(id: string) {
    if (!editingContent.trim()) return;
    updateComment(
      { id, content: editingContent },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingContent("");
        },
      },
    );
  }

  async function handleDelete(id: string) {
    const ok = await confirm();
    if (ok) {
      deleteComment(id);
    }
  }

  const startEditing = (id: string, initialContent: string) => {
    setEditingId(id);
    setEditingContent(initialContent);
  };

  return (
    <>
      <ConfirmDialog />
      <div>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 w-full text-left mb-4"
        >
          {open ? (
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          )}
          <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">댓글</span>
          <span className="text-xs text-muted-foreground ml-1">
            {comments.length}
          </span>
        </button>

        {open && (
          <div className="ml-6 space-y-6">
            <div className="flex gap-3 pt-2">
              <CircleAvatar
                url={currentUserImage}
                name={currentUserName ?? "나"}
              />
              <div className="flex-1">
                <textarea
                  placeholder="댓글 추가..."
                  rows={1}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border/60 rounded-lg text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring focus:bg-background transition-colors"
                  onFocus={(e) => {
                    e.currentTarget.rows = 3;
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) e.currentTarget.rows = 1;
                  }}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setContent("")}
                  >
                    취소
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-7"
                    disabled={!content.trim() || isCreating}
                    onClick={handleCreate}
                  >
                    {isCreating ? "작성 중..." : "작성"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-4">
              {isLoading ? (
                <div className="text-xs text-muted-foreground animate-pulse">
                  댓글을 불러오는 중...
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group">
                    <CircleAvatar
                      url={comment.user.image ?? undefined}
                      name={comment.user.name ?? "User"}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                        {comment.userId === session?.id && (
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-6"
                                >
                                  <MoreVerticalIcon className="size-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuItem
                                  onClick={() =>
                                    startEditing(comment.id, comment.content)
                                  }
                                  className="text-xs"
                                >
                                  <PencilIcon className="size-3 mr-2" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(comment.id)}
                                  className="text-xs text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                                >
                                  <Trash2Icon className="size-3 mr-2 text-destructive" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>

                      {editingId === comment.id ? (
                        <div className="mt-1">
                          <textarea
                            rows={3}
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none"
                            autoFocus
                          />
                          <div className="mt-2 flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => setEditingId(null)}
                            >
                              취소
                            </Button>
                            <Button
                              size="sm"
                              className="text-xs h-7"
                              disabled={!editingContent.trim() || isUpdating}
                              onClick={() => handleUpdate(comment.id)}
                            >
                              {isUpdating ? "저장 중..." : "저장"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
                          {comment.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
