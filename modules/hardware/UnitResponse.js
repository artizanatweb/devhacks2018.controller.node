class PirUnitResponse {
    constructor(unit_id, value) {
        this.unit_id = unit_id;
        this.value = value;
    }

    toJson() {
        return JSON.stringify(this);
    }
}

module.exports = PirUnitResponse;