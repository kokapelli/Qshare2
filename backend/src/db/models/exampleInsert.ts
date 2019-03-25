import Example from "./example";

const createExampleInsert = async () => {
    await Example.create({
        firstName: "Jane"
    });
};

export { createExampleInsert };
