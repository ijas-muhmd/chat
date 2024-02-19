import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  currentUser: string = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentUser = params['username'];
    });
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get('http://localhost:8000/get-users/')
      .subscribe({
        next: (response: any) => this.users = response,
        error: (error) => console.error('Failed to fetch users', error)
      });
  }

  selectUser(username: string): void {
    // Navigate to chat window with selected user
    this.router.navigate(['/chat'], { queryParams: { currentUser: this.currentUser, chatWith: username } });
  }

}
