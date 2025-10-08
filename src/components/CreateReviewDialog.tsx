import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface CreateReviewDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newReview: { title: string; movieName: string; content: string };
  setNewReview: (review: { title: string; movieName: string; content: string }) => void;
  handleCreateReview: () => void;
}

const CreateReviewDialog = ({
  isOpen,
  setIsOpen,
  newReview,
  setNewReview,
  handleCreateReview,
}: CreateReviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить рецензию
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-primary/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-secondary">Новая рецензия</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Заголовок (5-100 символов)</Label>
            <Input 
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="bg-background border-muted"
            />
          </div>
          <div>
            <Label>Название фильма (5-100 символов)</Label>
            <Input 
              value={newReview.movieName}
              onChange={(e) => setNewReview({ ...newReview, movieName: e.target.value })}
              className="bg-background border-muted"
            />
          </div>
          <div>
            <Label>Текст рецензии (100-5000 символов)</Label>
            <Textarea 
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              className="bg-background border-muted min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground mt-1">{newReview.content.length} символов</p>
          </div>
          <Button onClick={handleCreateReview} className="w-full bg-primary hover:bg-primary/90">
            Отправить на модерацию
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReviewDialog;
