import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

type UserRole = 'guest' | 'user' | 'admin';
type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface Review {
  id: string;
  title: string;
  movieName: string;
  content: string;
  author: string;
  likes: number;
  date: string;
  status: ReviewStatus;
  likedBy: string[];
}

interface ReviewDialogProps {
  review: Review | null;
  onClose: () => void;
  userRole: UserRole;
  currentUser: string;
  activeView: 'all' | 'my' | 'moderation';
  handleLike: (reviewId: string) => void;
  handleDeleteReview: (reviewId: string) => void;
  handleModerateReview: (reviewId: string, status: ReviewStatus) => void;
}

const ReviewDialog = ({
  review,
  onClose,
  userRole,
  currentUser,
  activeView,
  handleLike,
  handleDeleteReview,
  handleModerateReview,
}: ReviewDialogProps) => {
  if (!review) return null;

  return (
    <Dialog open={!!review} onOpenChange={onClose}>
      <DialogContent className="bg-card border-primary/20 max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-secondary">{review.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon name="Film" size={20} />
            <span className="text-lg font-medium text-foreground">{review.movieName}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="User" size={16} />
              <span>{review.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <span>{review.date}</span>
            </div>
            {review.author === currentUser && (
              <Badge variant={review.status === 'approved' ? 'default' : review.status === 'pending' ? 'secondary' : 'destructive'}>
                {review.status === 'approved' ? 'Одобрено' : review.status === 'pending' ? 'На модерации' : 'Отклонено'}
              </Badge>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-wrap">{review.content}</p>
          </div>
          {review.status === 'approved' && (
            <div className="flex items-center gap-4 pt-4 border-t border-muted">
              <div className="flex items-center gap-2">
                <Icon name="ThumbsUp" size={20} className="text-secondary" />
                <span className="text-muted-foreground">{review.likes} лайков</span>
              </div>
              {userRole !== 'guest' && (
                <Button 
                  variant={review.likedBy.includes(currentUser) ? 'default' : 'outline'}
                  onClick={() => handleLike(review.id)}
                  className={review.likedBy.includes(currentUser) ? 'bg-secondary text-secondary-foreground' : ''}
                >
                  {review.likedBy.includes(currentUser) ? 'Убрать лайк' : 'Поставить лайк'}
                </Button>
              )}
            </div>
          )}
          {userRole !== 'guest' && review.author === currentUser && (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Icon name="Edit" size={18} className="mr-2" />
                Редактировать
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Icon name="Trash2" size={18} className="mr-2" />
                    Удалить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-primary/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить рецензию?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteReview(review.id)} className="bg-destructive hover:bg-destructive/90">
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          {userRole === 'admin' && activeView === 'moderation' && (
            <div className="flex gap-2">
              <Button onClick={() => handleModerateReview(review.id, 'approved')} className="flex-1 bg-green-600 hover:bg-green-700">
                <Icon name="Check" size={18} className="mr-2" />
                Одобрить
              </Button>
              <Button onClick={() => handleModerateReview(review.id, 'rejected')} variant="destructive" className="flex-1">
                <Icon name="X" size={18} className="mr-2" />
                Отклонить
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
