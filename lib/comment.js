class Comment {
  constructor(name, comment, dateAndTime) {
    this.name = name;
    this.comment = comment;
    this.dateAndTime = dateAndTime;
  }
  toHTML() {
    const date = new Date(this.dateAndTime).toLocaleDateString();
    const time = new Date(this.dateAndTime).toLocaleTimeString();
    const comment = this.comment.replace(/(\r\n)/g, '<br>');
    return `<tr> 
    <td>${date}</td> 
    <td>${time}</td> 
    <td>${this.name}</td> 
    <td>${comment}</td>
  </tr>`;
  }
}

class Comments {
  constructor() {
    this.comments = [];
  }
  static load(content) {
    const commentList = JSON.parse(content || '[]');
    const comments = new Comments();
    commentList.forEach(content => {
      const { name, comment, dateAndTime } = content;
      comments.comments.push(new Comment(name, comment, dateAndTime));
    });
    return comments;
  }
  addComment(comment) {
    this.comments.unshift(comment);
  }
  toHTML() {
    return this.comments.map(content => {
      return content.toHTML();
    }).join('\n');
  }
  stringify() {
    return JSON.stringify(this.comments);
  }
}

module.exports = { Comment, Comments };
