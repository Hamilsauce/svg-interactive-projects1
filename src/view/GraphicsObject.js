// import { Movable } from './Movable.js';
// import { Canvas, createCanvasTransform } from './Canvas.js';
const ShapeTypeMap = new Map()

export class GraphicsObject {
  constructor({ type, canvas, attrs }) {
    this.attrs = attrs

    // this.canvas = svg || Canvas;
    this.canvas = canvas // || Canvas;


    this.self = document.createElementNS(this.namespaceURI, type)
    canvas.appendChild(this.self)
    console.log('this.self', this.self)

    // Object.assign(this, attrs)

    this.transforms = this.self.transform.baseVal;
    this.selfTranslate = this.createSVGTransform();

    if (this.transforms.length === 0) {
      this.selfTranslate.setTranslate(0, 0);
      this.transforms.insertItemBefore(this.selfTranslate, 0);
    }
  }

  point() {}

  createSVGTransform() { if (this.canvas) return this.canvas.createSVGTransform() }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }



  get parent() { return this.self.parentElement }

  // set parent(v) { this.self.parent = v }

  get style() { return this.self.style }

  set style(v) { this.self.style = v }

  get dataset() { return this.self.dataset }

  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.self.dataset[prop] = value) }

  get classList() { return this.self.classList }

  set classList(val) { this.self.classList.add(...val) }

  get id() { return this.self.id }

  set id(val) { this.self.id = val }

  get radiusX() { return this.width / 2 }

  get radiusY() { return this.height / 2 }

  get centroid() {
    return {
      x: this.x ? this.x + this.radiusX : this.cx + this.radiusX,
      y: this.y ? this.y + this.radiusY : this.cy + this.radiusY,
      y: this.y + this.radiusY,
    }
  }

  get x() { try { return this.self.x.baseVal.value } catch (e) { return null } }

  set x(val) { this.self.x.baseVal.value = val }

  get y() { try { return this.self.y.baseVal.value } catch (e) { return null } }

  set y(val) { this.self.y.baseVal.value = val }

  get cx() { try { return this.self.cx.baseVal.value } catch (e) { return null } }

  set cx(val) {
    console.log('this.self', this.shape)
    this.shape.cx.baseVal.value = val
  }

  get cy() { try { return this.self.cy.baseVal.value } catch (e) { return null } }

  set cy(val) { this.self.cy.baseVal.value = val }

  get r() { try { return this.self.r.baseVal.value } catch (e) { return null } }

  set r(val) { this.self.r.baseVal.value = val }

  get height() { try { return this.self.height.baseVal.value } catch (e) { return null } }

  set height(val) { this.self.height.baseVal.value = val }

  get width() { try { return this.self.width.baseVal.value } catch (e) { return null } }

  set width(val) { this.self.width.baseVal.value = val }

  get x1() { try { return this.self.x1.baseVal.value || 0 } catch (e) { return null } }

  set x2(val) { this.self.x2.baseVal.value = val }

  get y1() { try { return this.self.y1.baseVal.value || 0 } catch (e) { return null } }

  set y2(val) { this.self.y2.baseVal.value = val }

  get fill() { try { return this.self.getAttribute('fill') } catch (e) { return null } }

  set fill(val) { this.self.setAttribute('fill', val) }
}
