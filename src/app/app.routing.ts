import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
    { path: 'profile', component: UserProfileComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'ChatRoom/:id', component: ChatComponent },
    { path: 'loginUser', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}