class Instruction {
    constructor(instruction) {
        const digits = Array.from(instruction.toString().padStart(5, '0')).map(
            Number
        );
        this.PARAM_MODES = new Array(3);
        this.PARAM_MODES[0] = digits[2];
        this.PARAM_MODES[1] = digits[1];
        this.PARAM_MODES[2] = digits[0];
        this.OPCODE = parseInt(`${digits[3]}${digits[4]}`);
    }
}

function* IntcodeComputer(code) {
    const program = [...code];
    let ip = 0;
    let rb = 0;
    let input = yield 'ready';

    while (true) {
        const i = new Instruction(program[ip]);
        // console.log(i);
        let in1, in2, output_address;

        const setInOutParams = () => {
            /*  param modes:
                0: position mode
                1: immediate mode
                2: relative mode
            */
            const pos1 =
                i.PARAM_MODES[0] === 2 ? rb + program[ip + 1] : program[ip + 1];
            const pos2 =
                i.PARAM_MODES[1] === 2 ? rb + program[ip + 2] : program[ip + 2];
            in1 = i.PARAM_MODES[0] === 1 ? program[ip + 1] : program[pos1];
            in2 = i.PARAM_MODES[1] === 1 ? program[ip + 2] : program[pos2];
            output_address =
                (i.PARAM_MODES[2] === 2 ? rb : 0) + program[ip + 3];
        };
        setInOutParams();

        switch (i.OPCODE) {
            case 1:
                // Add
                program[output_address] = in1 + in2;
                ip += 4;
                break;
            case 2:
                // Multiply
                program[output_address] = in1 * in2;
                ip += 4;
                break;
            case 3:
                // Input
                console.log('Input', input);
                // debugger;
                output_address =
                    (i.PARAM_MODES[2] === 2 ? rb : 0) + program[ip + 1];
                program[output_address] = input;
                ip += 2;
                break;
            case 4:
                // Output
                ip += 2;
                input = yield in1;
                // console.log('Output - input set to:', input);
                break;
            case 5:
                // Jump-if-true
                ip = in1 !== 0 ? in2 : ip + 3;
                break;
            case 6:
                // Jump-if-false
                ip = in1 === 0 ? in2 : ip + 3;
                break;
            case 7:
                // Less than
                program[output_address] = in1 < in2 ? 1 : 0;
                ip += 4;
                break;
            case 8:
                // Equals
                program[output_address] = in1 == in2 ? 1 : 0;
                ip += 4;
                break;
            case 9:
                // Adjust relative base
                rb += in1;
                ip += 2;
                break;
            case 99:
                return;
            default:
                throw new Error('Unknown opCode: ', i.OPCODE);
        }
    }
}

export default IntcodeComputer;
