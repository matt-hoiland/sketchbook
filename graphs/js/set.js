class Set {
  constructor(data) {
    this.Node = class {
      constructor(datum) {
        this.d = datum
        this.l = null
        this.r = null
      }
    }
    this.root = null
    if (data) {
      this.insert(data)
    }
  }

  insert(t) {
    this.root = this._insert(t, this.root)
  }

  _insert(t, groot) {
    if (groot === null) {
      return new this.Node(t)
    }
    if (t.compareTo(groot.d) < 0) {
      groot.l = this._insert(t, groot.l)
    } else {
      groot.r = this._insert(t, groot.r)
    }
    return groot
  }

  has(t) {
    return this._has(t, this.root)
  }

  _has(t, groot) {
    if (groot === null) {
      return false
    }
    if (t === groot.d) {
      return true
    }
    if (t.compareTo(groot.d) < 0) {
      return this._has(t, groot.l)
    } else {
      return this._has(t, groot.r)
    }
  }

  merge(that) {
    this._merge(that.root)
    that.root = null
  }

  _merge(groot) {
    if (groot === null) {
      return
    }
    this._merge(groot.l)
    this._merge(groot.r)
    this.insert(groot.d)
  }
}


class DisjointSet extends Array {
  constructor(data) {
    super()
    if (data) {
      for (let datum of data) {
        this.push(new Set(datum))
      }
    }
  }

  get num_sets() {
    return this.length
  }

  find(a) {
    for (let s of this) {
      if (s.has(a)) {
        return s
      }
    }
    return null
  }

  areDisjoint(a, b) {
    return this.find(a) !== this.find(b)
  }

  union(a, b) {
    let sa = this.find(a)
    let sb = this.find(b)
    sa.merge(sb)
    let ib = this.indexOf(sb)
    this[ib] = this[this.length - 1]
    this.pop()
  }
}
