const db = require("./conn");

function generatePairObject(arr) {
    let obj = {};
    if (arr.length % 2 !== 0) {
        throw new Error('string array must have even length!')
    }
    arr.forEach((val, i) => {
        if ((i % 2) === 0) {
            obj[val] = null;
        } else {
            obj[arr[i - 1]] = val;
        }
    });
    return obj;
}

class Problem {
    constructor(
        id,
        problemStatement,
        type,
        answer_representation,
        answer_value,
        solution,
        category_id
    ) {
        this.id = id;
        this.problemStatement = problemStatement;
        this.type = type;
        this.answer_representation = answer_representation;
        this.answer_value = answer_value;
        this.solution = solution;
        this.category_id = category_id;
    }

    static base64Decode (str, encoding = 'utf-8') {
        return Buffer.from(str, 'base64').toString('utf8')
    }

    static base64Encode(str, encoding = 'utf-8') {
        return Buffer.from(str, 'utf8').toString('base64')
    }

    static async getTotalProblemCount() {
        try {
            const response = await db.one(`
            SELECT COUNT (*) FROM problems;
            `);
            return response;
        } catch(error) {
            return error.message;
        }
    }

    static async getProblemById(id) {
        try {
            const response = await db.one(
                `SELECT * FROM problems WHERE id = $1;`,
                [id]
            );
            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async getAll() {
        try {
            const response = await db.query(`SELECT * FROM problems;`);
            return response;
        } catch (error) {
            console.log(error.message);
            return error.message;
        }
    }

    static async getProblemById(id) {
        try {
            const response = await db.one(
                `SELECT * FROM problems WHERE id = $1;`,
                [id]
            );
            return response;
        } catch (err) {
            return err.message;
        }
    }

    // The user needs to input answers with spaces in between values e.g x1 0.5 x2 -3
    // answerCheck evaluates the user's answer from the form submission and evaluates depending upon the problem type and returns a boolean
    static answerCheck(problem_type, problem_answer, user_answer) {
        console.log(problem_type, problem_answer, user_answer)

        const problemAnswerObj = this.convertArrayDataToObj(problem_answer);
        const userAnswerArray = problem_type === 'manual_ordered' ? [] : user_answer.split(" ");
        const userAnswerObj = this.convertArrayDataToObj(userAnswerArray);

        let evaluation = true;

        switch (problem_type) {
            case "manual_ordered":
                        let solution = generatePairObject(problem_answer);
                        
                        for (let key in solution) {
                            if (solution[key] !== user_answer[key]) {
                                evaluation = false;
                                break;
                            }
                        }
                break;

            case "manual_unordered":
                let problemKeysArray = JSON.stringify(
                    Object.keys(problemAnswerObj).sort()
                );
                let userKeysArray = JSON.stringify(
                    Object.keys(userAnswerObj).sort()
                );

                let problemValuesArray = JSON.stringify(
                    Object.values(problemAnswerObj).sort()
                );
                let userValuesArray = JSON.stringify(
                    Object.values(userAnswerObj).sort()
                );

                problemKeysArray == userKeysArray &&
                problemValuesArray == userValuesArray
                    ? (evaluation = true)
                    : (evaluation = false);

                break;

            // since truefalse is single value answer, we can use don't have to convert problemAnswerValue. Can just rely on the arguments passed in directly
            case "truefalse":
                evaluation = problem_answer == user_answer[0]
                    ? (evaluation = true)
                    : (evaluation = false);
                break;

            default:
                console.err("The problem type is not valid.");
        }
        return evaluation;
    }

    // Helper Function that can convert an PSQL Array to JSON
    static convertArrayDataToObj(obj) {
        const objectToConvert = obj;
        const objLength = objectToConvert.length;
        let objAnswer = new Object();

        // This loop dynamically travels the length of the array data and populates key/value pairs and returns an object
        for (let i = 0; i < objLength; i += 2) {
            let key = objectToConvert[i];
            let value = objectToConvert[i + 1];

            objAnswer[key] = value;
        }

        return objAnswer;
    }

}

module.exports = Problem;
