export class EventQueue {
  constructor(capacity) {
    this.list = [];
    this.capacity = capacity || 50;
    this.head = 0;
    this.tail = 0;
  }

  get size() {
    return this.tail - this.head
  }

  get isFull() {
    return this.capacity && this.tail === this.capacity;
  }

  get isEmpty() { return this.size === 0 };

  enqueue(item) {
    if (!this.isFull) {
      this.list[this.tail] = item;
      this.tail += 1;
    }
  }

  dequeue() {
    let item = null;

    if (!this.isEmpty) {
      item = this.list[this.head];
      delete this.list[this.head];
    }
    return item;
  }

  peek() {
    if (this.isEmpty) {
      return null;
    }

    return this.list[this.head];
  }

  clear() {
    if (this.capacity) {
      this.list = Array.from({ length: this.capacity });
    } else {
      this.list = [];
    }

    this.head = 0;
    this.tail = 0;
  }

  print() {
    const list = [];

    this.list.forEach(item => {
      list.push(item);
    })

    console.log(list)
  }

  toString() {
    if (this.isEmpty) return '';

    let str = `${this.list[this.head]}`;

    for (let i = this.head + 1; i < this.tail; i++) {
      str += `, ${this.list[i]}`;
    }

    return str;
  }
}
