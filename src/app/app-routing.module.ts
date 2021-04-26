import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [

    {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]

    },
    {
        path: 'detail/:pokemon',
        loadChildren: () => import('./pages/detail/detail.module').then(m => m.DetailPageModule),
        canActivate: [AuthGuard]

    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
