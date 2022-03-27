import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

interface MainComment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: any;
  replies: any;
  active?: boolean;
  activeEdit?: boolean;
}

interface ReplyComments {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  user: any;
  active?: boolean;
  activeEdit?: boolean;
}

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  textValue: string = '';
  replyTextValue: string = '';
  editTextValue: string = '';
  objects: any = {};
  createNewId: number = Date.now();
  newId: number = 4;

  constructor(private usersService: UsersService) { };

  saveItems() {
    localStorage.setItem('comments', JSON.stringify(this.objects))
  }

  getItems() {
    const commentStorage = localStorage.getItem('comments');
    if (commentStorage) {
      this.objects = JSON.parse(commentStorage);
    }
    return this.objects;
  }

  incrementScore(user: MainComment | ReplyComments, comms: MainComment[] | ReplyComments[]) {
    user.score++;
    this.objects.comms = comms.sort((a: any, b: any) => b.score - a.score);
    this.saveItems();
  };

  decrementScore(user: MainComment | ReplyComments, comms: any) {
    user.score--;
    this.objects.comms = comms.sort((a: any, b: any) => b.score - a.score);
    this.saveItems();
  };

  editText(user: any, comments: any) {
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id == user.id) {
        comments[i].content = this.editTextValue;
        break;
      }
    }
    user.activeEdit = false;
    this.saveItems();
  }

  editMessage(user: MainComment | ReplyComments) {
    user.activeEdit = !user.activeEdit;
    this.editTextValue = user.content;
  }

  deleteMessage(user: MainComment | ReplyComments, comments: MainComment[] | ReplyComments[]) {
    let count = 0;
    console.log(user);
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id == user.id) {
        comments.splice(i, 1);
        break;
      }
    }
    this.saveItems();
  }

  addToMainComments(comms: MainComment[]) {
    const date = new Date();
    this.newId++;

    const mainComment: MainComment = {
      id: this.newId,
      content: this.textValue,
      createdAt: `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      score: 0,
      user: {
        image: {
          png: "../assets/images/avatars/image-juliusomo.png",
          webp: "../assets/images/avatars/image-juliusomo.webp"
        },
        username: "juliusomo"
      },
      replies: []
    };

    comms.push(mainComment);
    this.textValue = '';
    this.saveItems();
  }

  addReply(user: MainComment, comments: MainComment[]) {
    const date = new Date();
    this.newId++;

    const comment: ReplyComments = {
      id: this.newId,
      content: this.replyTextValue,
      createdAt: `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      score: 0,
      replyingTo: "",
      user: {
        image: {
          png: "../assets/images/avatars/image-juliusomo.png",
          webp: "../assets/images/avatars/image-juliusomo.webp"
        },
        username: "juliusomo"
      }
    }

    user.replies.push(comment);

    this.replyTextValue = '';
    user.active = false;
    user.replies.map((el: { active: boolean; }) => el.active = false)
    this.saveItems();
  };

  createMessageSection(user: MainComment) {
    user.active = !user.active;
  };

  async ngOnInit(): Promise<void> {
    // this.objects = await this.usersService.getUsers();
    this.objects = this.getItems();
  };
}
