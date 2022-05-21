export class Hexagon {
  constructor() {
    this.path = document.createElementNS(this.namespaceURI, 'path')
    this.self = this.path

    // Object.assign(this, attrs)

    // this.selfTransforms = this.self.transform.baseVal;

    // if (this.selfTransforms.length === 0) {
    //   this.selfTranslate = this.canvas.createSVGTransform();
    //   this.selfTranslate.setTranslate(0, 0);
    //   this.selfTransforms.insertItemBefore(this.selfTranslate, 0);
    // }
  }

  init(cx, cy, r) {
    const center = { x: cx, y: cy }
    

  }

  static create(cx, cy, r, attributes) {
    const h = new Hexagon()
    h.init(cx, cy, r);
    return h
  }
  // createSVGTransform() { return this.canvas.createSVGTransform() }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }

  get dataset() { return this.self.dataset }

  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.self.dataset[prop] = value) }

  get classList() { return this.self.classList }

  set classList(val) { this.self.classList.add(...val) }

  get id() { return this.self.id }

  set id(val) { this.self.id = val }

  get canvas() { return this._canvas }

  set canvas(val) { this._canvas = val }

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

  set cx(val) { this.self.cx.baseVal.value = val }

  get cy() { try { return this.self.cy.baseVal.value } catch (e) { return null } }

  set cy(val) { this.self.cy.baseVal.value = val }

  get r() { try { return this.self.r.baseVal.value } catch (e) { return null } }

  set r(val) { this.self.r.baseVal.value = val }

  get height() { try { return this.self.height.baseVal.value } catch (e) { return null } }

  set height(val) { this.self.height.baseVal.value = val }

  get width() { try { return this.self.width.baseVal.value } catch (e) { return null } }

  set width(val) { this.self.width.baseVal.value = val }

  get x1() { return this.self.x1.baseVal.value || 0 }

  set x2(val) { this.self.x2.baseVal.value = val }

  get y1() { return this.self.y1.baseVal.value || 0 }

  set y2(val) { this.self.y2.baseVal.value = val }

  get fill() { return this.self.getAttribute('fill') }

  set fill(val) { this.self.setAttribute('fill', val) }
}
