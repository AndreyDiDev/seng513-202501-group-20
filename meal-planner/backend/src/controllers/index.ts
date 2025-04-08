class IndexController {
    public async getIndex(req, res) {
        res.status(200).json({ message: "Welcome to the API!" });
    }

    public async getData(req, res) {
        // Example method to get data
        res.status(200).json({ data: "Sample data" });
    }

    public async postData(req, res) {
        // Example method to post data
        const { body } = req;
        res.status(201).json({ message: "Data received", data: body });
    }
}

export default new IndexController();