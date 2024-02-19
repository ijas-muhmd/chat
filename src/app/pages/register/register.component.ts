import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username: string = '';
  joinUsername: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    
    this.http.post('http://localhost:8000/create-users/', { username: this.username })
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          alert('Registration successful');
          
        },
        error: (error) => console.error('Registration failed', error)
      });
  }

  join(): void {
    // Directly call the `user_exists` endpoint with the joinUsername
    this.http.get(`http://localhost:8000/user-exists/${this.joinUsername}`).subscribe({
      next: (response: any) => {
        if (response.exists) {
          // If user exists, navigate to the users component
          this.router.navigate(['/users'], { queryParams: { username: this.joinUsername } });
        } else {
          // If user does not exist, prevent navigation and show an error message
          alert('This username does not exist. Please register first.');
        }
      },
      error: (error) => {
        console.error('Failed to check username', error);
        alert('There was an error checking the username. Please try again.');
      }
    });
  }

}
