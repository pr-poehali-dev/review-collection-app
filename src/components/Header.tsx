import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type UserRole = 'guest' | 'user' | 'admin';

interface HeaderProps {
  userRole: UserRole;
  currentUser: string;
  activeView: 'all' | 'my' | 'moderation';
  setActiveView: (view: 'all' | 'my' | 'moderation') => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;
  loginData: { login: string; password: string };
  setLoginData: (data: { login: string; password: string }) => void;
  registerData: { login: string; password: string };
  setRegisterData: (data: { login: string; password: string }) => void;
  handleLogin: () => void;
  handleRegister: () => void;
  handleLogout: () => void;
}

const Header = ({
  userRole,
  currentUser,
  activeView,
  setActiveView,
  isLoginOpen,
  setIsLoginOpen,
  isRegisterOpen,
  setIsRegisterOpen,
  loginData,
  setLoginData,
  registerData,
  setRegisterData,
  handleLogin,
  handleRegister,
  handleLogout,
}: HeaderProps) => {
  return (
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
  );
};

export default Header;
