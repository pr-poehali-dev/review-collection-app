import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
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

const mockReviews: Review[] = [
  {
    id: '1',
    title: 'Шедевр современного кинематографа',
    movieName: 'Оппенгеймер',
    content: 'Кристофер Нолан создал невероятно глубокий и технически совершенный фильм о создателе атомной бомбы. Каждый кадр продуман до мелочей, актёрская игра на высшем уровне, а монтаж создаёт уникальное напряжение на протяжении всех трёх часов...',
    author: 'Александр',
    likes: 42,
    date: '2024-10-01',
    status: 'approved',
    likedBy: []
  },
  {
    id: '2',
    title: 'Визуальная поэзия Дени Вильнёва',
    movieName: 'Дюна: Часть вторая',
    content: 'Вильнёв доказывает, что умеет снимать эпические блокбастеры без потери художественной ценности. Визуальные эффекты органично вплетены в повествование, а саундтрек Ханса Циммера создаёт неповторимую атмосферу...',
    author: 'Мария',
    likes: 38,
    date: '2024-09-28',
    status: 'approved',
    likedBy: []
  }
];

const Index = () => {
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState('');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'all' | 'my' | 'moderation'>('all');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [registerData, setRegisterData] = useState({ login: '', password: '' });
  const [newReview, setNewReview] = useState({ title: '', movieName: '', content: '' });
  
  const { toast } = useToast();

  const handleLogin = () => {
    if (loginData.login.length < 4 || loginData.login.length > 20) {
      toast({ title: 'Ошибка', description: 'Логин должен быть от 4 до 20 символов', variant: 'destructive' });
      return;
    }
    if (loginData.password.length < 8 || loginData.password.length > 16) {
      toast({ title: 'Ошибка', description: 'Пароль должен быть от 8 до 16 символов', variant: 'destructive' });
      return;
    }
    
    const role = loginData.login === 'admin' ? 'admin' : 'user';
    setUserRole(role);
    setCurrentUser(loginData.login);
    setIsLoginOpen(false);
    toast({ title: 'Вход выполнен', description: `Добро пожаловать, ${loginData.login}!` });
  };

  const handleRegister = () => {
    if (registerData.login.length < 4 || registerData.login.length > 20) {
      toast({ title: 'Ошибка', description: 'Логин должен быть от 4 до 20 символов', variant: 'destructive' });
      return;
    }
    if (registerData.password.length < 8 || registerData.password.length > 16) {
      toast({ title: 'Ошибка', description: 'Пароль должен быть от 8 до 16 символов', variant: 'destructive' });
      return;
    }
    
    setUserRole('user');
    setCurrentUser(registerData.login);
    setIsRegisterOpen(false);
    toast({ title: 'Регистрация успешна', description: 'Добро пожаловать!' });
  };

  const handleLogout = () => {
    setUserRole('guest');
    setCurrentUser('');
    setActiveView('all');
    toast({ title: 'Выход', description: 'До встречи!' });
  };

  const handleCreateReview = () => {
    if (newReview.title.length < 5 || newReview.title.length > 100) {
      toast({ title: 'Ошибка', description: 'Заголовок должен быть от 5 до 100 символов', variant: 'destructive' });
      return;
    }
    if (newReview.movieName.length < 5 || newReview.movieName.length > 100) {
      toast({ title: 'Ошибка', description: 'Название фильма должно быть от 5 до 100 символов', variant: 'destructive' });
      return;
    }
    if (newReview.content.length < 100 || newReview.content.length > 5000) {
      toast({ title: 'Ошибка', description: 'Текст рецензии должен быть от 100 до 5000 символов', variant: 'destructive' });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      ...newReview,
      author: currentUser,
      likes: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      likedBy: []
    };
    
    setReviews([review, ...reviews]);
    setIsCreateOpen(false);
    setNewReview({ title: '', movieName: '', content: '' });
    toast({ title: 'Рецензия отправлена', description: 'Ожидайте модерации' });
  };

  const handleLike = (reviewId: string) => {
    setReviews(reviews.map(r => {
      if (r.id === reviewId) {
        const hasLiked = r.likedBy.includes(currentUser);
        return {
          ...r,
          likes: hasLiked ? r.likes - 1 : r.likes + 1,
          likedBy: hasLiked ? r.likedBy.filter(u => u !== currentUser) : [...r.likedBy, currentUser]
        };
      }
      return r;
    }));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
    setSelectedReview(null);
    toast({ title: 'Рецензия удалена' });
  };

  const handleModerateReview = (reviewId: string, newStatus: ReviewStatus) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
    setSelectedReview(null);
    toast({ title: 'Статус изменён', description: newStatus === 'approved' ? 'Рецензия одобрена' : 'Рецензия отклонена' });
  };

  const filteredReviews = reviews.filter(r => {
    if (activeView === 'moderation') return r.status === 'pending';
    if (activeView === 'my') return r.author === currentUser;
    if (activeView === 'all') return r.status === 'approved';
    return false;
  }).filter(r => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return r.title.toLowerCase().includes(query) || r.movieName.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Film" className="text-secondary" size={32} />
              <h1 className="text-2xl font-bold text-secondary">Cinema Reviews</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {userRole === 'guest' && (
                <>
                  <Button variant="ghost" onClick={() => setActiveView('all')} className="text-foreground hover:text-secondary">
                    Все рецензии
                  </Button>
                  <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                        Вход
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-primary/20">
                      <DialogHeader>
                        <DialogTitle className="text-secondary">Вход</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Логин</Label>
                          <Input 
                            value={loginData.login}
                            onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
                            className="bg-background border-muted"
                          />
                        </div>
                        <div>
                          <Label>Пароль</Label>
                          <Input 
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="bg-background border-muted"
                          />
                        </div>
                        <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90">
                          Войти
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90">
                        Регистрация
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-primary/20">
                      <DialogHeader>
                        <DialogTitle className="text-secondary">Регистрация</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Логин</Label>
                          <Input 
                            value={registerData.login}
                            onChange={(e) => setRegisterData({ ...registerData, login: e.target.value })}
                            className="bg-background border-muted"
                          />
                        </div>
                        <div>
                          <Label>Пароль</Label>
                          <Input 
                            type="password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            className="bg-background border-muted"
                          />
                        </div>
                        <Button onClick={handleRegister} className="w-full bg-primary hover:bg-primary/90">
                          Зарегистрироваться
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              
              {userRole === 'user' && (
                <>
                  <Button variant="ghost" onClick={() => setActiveView('all')} className={activeView === 'all' ? 'text-secondary' : 'text-foreground hover:text-secondary'}>
                    Все рецензии
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveView('my')} className={activeView === 'my' ? 'text-secondary' : 'text-foreground hover:text-secondary'}>
                    Мои рецензии
                  </Button>
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={20} className="text-secondary" />
                    <span className="text-sm text-muted-foreground">{currentUser}</span>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Выйти
                  </Button>
                </>
              )}
              
              {userRole === 'admin' && (
                <>
                  <Button variant="ghost" onClick={() => setActiveView('all')} className={activeView === 'all' ? 'text-secondary' : 'text-foreground hover:text-secondary'}>
                    Все рецензии
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveView('my')} className={activeView === 'my' ? 'text-secondary' : 'text-foreground hover:text-secondary'}>
                    Мои рецензии
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveView('moderation')} className={activeView === 'moderation' ? 'text-secondary' : 'text-foreground hover:text-secondary'}>
                    Модерация
                  </Button>
                  <div className="flex items-center gap-2">
                    <Icon name="ShieldCheck" size={20} className="text-secondary" />
                    <span className="text-sm text-muted-foreground">{currentUser}</span>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Выйти
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative h-[400px] overflow-hidden">
        <img 
          src="https://cdn.poehali.dev/projects/217c2f70-09cd-495d-a8ae-cf13ac048e82/files/e9cd3de7-f32e-43ae-9bf7-18c6acb40946.jpg"
          alt="Cinema"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-secondary">Кинорецензии</h2>
            <p className="text-xl text-muted-foreground">Делитесь своим мнением о фильмах</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input 
                placeholder="Поиск по заголовку или названию фильма..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-muted"
              />
            </div>
            {userRole !== 'guest' && activeView === 'my' && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
            )}
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Рецензий не найдено</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="bg-card border-primary/20 hover-scale animate-fade-in cursor-pointer" onClick={() => setSelectedReview(review)}>
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
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent className="bg-card border-primary/20 max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-secondary">{selectedReview.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Film" size={20} />
                <span className="text-lg font-medium text-foreground">{selectedReview.movieName}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} />
                  <span>{selectedReview.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} />
                  <span>{selectedReview.date}</span>
                </div>
                {selectedReview.author === currentUser && (
                  <Badge variant={selectedReview.status === 'approved' ? 'default' : selectedReview.status === 'pending' ? 'secondary' : 'destructive'}>
                    {selectedReview.status === 'approved' ? 'Одобрено' : selectedReview.status === 'pending' ? 'На модерации' : 'Отклонено'}
                  </Badge>
                )}
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{selectedReview.content}</p>
              </div>
              {selectedReview.status === 'approved' && (
                <div className="flex items-center gap-4 pt-4 border-t border-muted">
                  <div className="flex items-center gap-2">
                    <Icon name="ThumbsUp" size={20} className="text-secondary" />
                    <span className="text-muted-foreground">{selectedReview.likes} лайков</span>
                  </div>
                  {userRole !== 'guest' && (
                    <Button 
                      variant={selectedReview.likedBy.includes(currentUser) ? 'default' : 'outline'}
                      onClick={() => handleLike(selectedReview.id)}
                      className={selectedReview.likedBy.includes(currentUser) ? 'bg-secondary text-secondary-foreground' : ''}
                    >
                      {selectedReview.likedBy.includes(currentUser) ? 'Убрать лайк' : 'Поставить лайк'}
                    </Button>
                  )}
                </div>
              )}
              {userRole !== 'guest' && selectedReview.author === currentUser && (
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
                        <AlertDialogAction onClick={() => handleDeleteReview(selectedReview.id)} className="bg-destructive hover:bg-destructive/90">
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
              {userRole === 'admin' && activeView === 'moderation' && (
                <div className="flex gap-2">
                  <Button onClick={() => handleModerateReview(selectedReview.id, 'approved')} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Icon name="Check" size={18} className="mr-2" />
                    Одобрить
                  </Button>
                  <Button onClick={() => handleModerateReview(selectedReview.id, 'rejected')} variant="destructive" className="flex-1">
                    <Icon name="X" size={18} className="mr-2" />
                    Отклонить
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
