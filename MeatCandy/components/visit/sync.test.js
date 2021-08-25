const rewire = require("rewire")
const sync = rewire("./sync")
const mapStateToProps = sync.__get__("mapStateToProps")
const Sync = sync.__get__("Sync")
// @ponicode
describe("mapStateToProps", () => {
    test("0", () => {
        let callFunction = () => {
            mapStateToProps({ token: "<", authReducer: "u7djsl186ksk99-DsklLk89" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            mapStateToProps({ token: "<", authReducer: "oAuthToken" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            mapStateToProps({ token: "~@", authReducer: "u7djsl186ksk99-DsklLk89" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            mapStateToProps({ token: "{", authReducer: "oAuthToken" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            mapStateToProps({ token: ")]}", authReducer: "u7djsl186ksk99-DsklLk89" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            mapStateToProps(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("loadData", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.loadData()
    })
})

// @ponicode
describe("componentDidMount", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.componentDidMount()
    })
})

// @ponicode
describe("sendSingleVisit", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.sendSingleVisit({ visit_obj: { visit_plan_visit_id: 0, visit_plan_id: [true, false, true] } })
    })

    test("1", async () => {
        await inst.sendSingleVisit({ visit_obj: { visit_plan_visit_id: -1, visit_plan_id: [false, false, false] } })
    })

    test("2", async () => {
        await inst.sendSingleVisit({ visit_obj: { visit_plan_visit_id: 1, visit_plan_id: [true, true, true] } })
    })

    test("3", async () => {
        await inst.sendSingleVisit({ visit_obj: { visit_plan_visit_id: true, visit_plan_id: [false, true, true] } })
    })

    test("4", async () => {
        await inst.sendSingleVisit({ visit_obj: { visit_plan_visit_id: false, visit_plan_id: [false, true, true] } })
    })

    test("5", async () => {
        await inst.sendSingleVisit(undefined)
    })
})

// @ponicode
describe("sendVisit", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.sendVisit(false)
    })

    test("1", async () => {
        await inst.sendVisit(true)
    })

    test("2", async () => {
        await inst.sendVisit(undefined)
    })
})

// @ponicode
describe("syncVisit", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncVisit()
    })
})

// @ponicode
describe("syncWorkTime", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", () => {
        let callFunction = () => {
            inst.syncWorkTime()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("syncSku", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncSku()
    })
})

// @ponicode
describe("syncPlan", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncPlan()
    })
})

// @ponicode
describe("syncCompetitionCategories", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncCompetitionCategories()
    })
})

// @ponicode
describe("syncExtendedCompetitionCategories", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncExtendedCompetitionCategories()
    })
})

// @ponicode
describe("download", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.download("http://placeimg.com/640/480", "C:\\\\path\\to\\folder\\")
    })

    test("1", async () => {
        await inst.download("http://placeimg.com/640/480", "path/to/file.ext")
    })

    test("2", async () => {
        await inst.download("http://placeimg.com/640/480", "/path/to/file")
    })

    test("3", async () => {
        await inst.download("http://placeimg.com/640/480", "path/to/folder/")
    })

    test("4", async () => {
        await inst.download("http://placeimg.com/640/480", "C:\\\\path\\to\\file.ext")
    })

    test("5", async () => {
        await inst.download(undefined, undefined)
    })
})

// @ponicode
describe("syncTrainings", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncTrainings()
    })
})

// @ponicode
describe("syncTarget", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncTarget()
    })
})

// @ponicode
describe("sync", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", () => {
        let callFunction = () => {
            inst.sync()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("syncForce", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.syncForce()
    })
})

// @ponicode
describe("clearStorage", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", async () => {
        await inst.clearStorage()
    })
})

// @ponicode
describe("syncAlert", () => {
    let inst

    beforeEach(() => {
        inst = new Sync()
    })

    test("0", () => {
        let callFunction = () => {
            inst.syncAlert()
        }
    
        expect(callFunction).not.toThrow()
    })
})
