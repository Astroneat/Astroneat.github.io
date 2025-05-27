class Comment {
    constructor(id, username, post_time, content) {
        this.el = createElement({ classList: `comment comment-${id}` });
        
        this.username_el = createElement({ classList: `username` });
        this.username_el.innerHTML = username;

        this.post_time_el = createElement({ classList: `post_time` });
        this.post_time_el.innerHTML = post_time;

        this.content_el = createElement({ classList: `content` });
        this.content_el.innerHTML = content;

        this.el.appendChild(this.username_el);
        this.el.appendChild(this.post_time_el);
        this.el.appendChild(this.content_el);
    }
}

function createElement({ tag, classList } = {}) {
    const element = document.createElement(tag || "div");
    element.classList = classList;
    return element;
}

function test() {
    let comment_board = document.querySelector(".comment");
    const test = new Comment(0, "Astroneat", 10, "Hi");
    comment_board.appendChild(test.el);
}