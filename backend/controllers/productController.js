const addProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.body;

        // 1. Validation checks
        switch (true) {
            case !name:
                return res.status(400).json({ error: "Name is required" });
            case !description:
                return res.status(400).json({ error: "Description is required" });
            case !price:
                return res.status(400).json({ error: "Price is required" });
            case !category:
                return res.status(400).json({ error: "Category is required" });
            case !quantity:
                return res.status(400).json({ error: "Quantity is required" });
            case !brand:
                return res.status(400).json({ error: "Brand is required" });
            case !req.file:
                return res.status(400).json({ error: "Image is required" });
        }

        // 2. Create product with Cloudinary secure URL from req.file.path
        const product = new Product({
            name,
            description,
            price,
            category,
            quantity,
            brand,
            image: req.file.path, // Automatically contains https://res.cloudinary.com/...
        });

        // 3. Save to MongoDB
        await product.save();

        // 4. Send success response
        res.status(201).json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.body;

        // 1. Validation checks
        switch (true) {
            case !name:
                return res.status(400).json({ error: "Name is required" });
            case !description:
                return res.status(400).json({ error: "Description is required" });
            case !price:
                return res.status(400).json({ error: "Price is required" });
            case !category:
                return res.status(400).json({ error: "Category is required" });
            case !quantity:
                return res.status(400).json({ error: "Quantity is required" });
            case !brand:
                return res.status(400).json({ error: "Brand is required" });
        }

        const updateData = {
            name,
            description,
            price,
            category,
            quantity,
            brand,
        };

        // If a new image was uploaded, update the image field with the new Cloudinary URL
        if (req.file) {
            updateData.image = req.file.path;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(product);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});