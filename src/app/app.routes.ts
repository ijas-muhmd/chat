import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'users', component: UsersComponent },
    { path: 'chat', component: ChatComponent }
];
