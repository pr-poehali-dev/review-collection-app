import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

interface ReviewCardProps {
  review: Review;
  activeView: 'all' | 'my' | 'moderation';
  onClick: () => void;
}

const ReviewCard = ({ review, activeView, onClick }: ReviewCardProps) => {
  return (
    <Card className="bg-card border-primary/20 hover-scale animate-fade-in cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-secondary mb-2">{review.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Icon name="Film" size={16} />
              <span className="text-foreground font-medium">{review.movieName}</span>
              <span>•</span>
              <span>{review.author}</span>
              <span>•</span>
              <span>{review.date}</span>
            </div>
          </div>
          {activeView === 'my' && (
            <Badge variant={review.status === 'approved' ? 'default' : review.status === 'pending' ? 'secondary' : 'destructive'}>
              {review.status === 'approved' ? 'Одобрено' : review.status === 'pending' ? 'На модерации' : 'Отклонено'}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-3 mb-4">{review.content}</p>
        {review.status === 'approved' && (
          <div className="flex items-center gap-2">
            <Icon name="ThumbsUp" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">{review.likes} лайков</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
