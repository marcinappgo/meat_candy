const day_plan = require("./day-plan")
// @ponicode
describe("selectVisit", () => {
    let inst

    beforeEach(() => {
        inst = new day_plan.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.selectVisit(false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.selectVisit(true)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.selectVisit(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("updateFilter", () => {
    let inst

    beforeEach(() => {
        inst = new day_plan.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.updateFilter("Foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.updateFilter("Hello, world!")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.updateFilter("foo bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.updateFilter("This is a Text")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst.updateFilter(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("clearFilter", () => {
    let inst

    beforeEach(() => {
        inst = new day_plan.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.clearFilter()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("setOption", () => {
    let inst

    beforeEach(() => {
        inst = new day_plan.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.setOption({})
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.setOption(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
