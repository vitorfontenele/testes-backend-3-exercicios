import { UserBusiness } from "../../src/business/UserBusiness"
import { SignupInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("cadastro bem-sucedido retorna token", async () => {
        const input: SignupInputDTO = {
            email: "example@email.com",
            name: "Example Mock",
            password: "bananinha"
        }

        const response = await userBusiness.signup(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("name deve ser string", async () => {
        expect.assertions(1);

        const input: SignupInputDTO = {
            email: "example@email.com",
            name: true,
            password: "bananinha"
        }

        try {
            await userBusiness.signup(input);
        } catch (error) {
           if (error instanceof BadRequestError) {
            expect(error.message).toBe("'name' deve ser string");
           }
        }
    })

    test("email deve ser string", async () => {
        expect.assertions(1);

        const input: SignupInputDTO = {
            email: 1,
            name: "Example Mock",
            password: "bananinha"
        }

        try {
            await userBusiness.signup(input);
        } catch (error) {
           if (error instanceof BadRequestError) {
            expect(error.message).toBe("'email' deve ser string");
           }
        }
    })

    test("password deve ser string", async () => {
        expect.assertions(1);

        const input: SignupInputDTO = {
            email: "example@email.com",
            name: "Example Mock",
            password: 555
        }

        try {
            await userBusiness.signup(input);
        } catch (error) {
           if (error instanceof BadRequestError) {
            expect(error.message).toBe("'password' deve ser string");
           }
        }
    })

    test("email repetido", () => {
        const input: SignupInputDTO = {
            email: "normal@email.com",
            name: "Normal Mock",
            password: "hash-bananinha"
        }

        expect(async () => {
            await userBusiness.signup(input)
        }).rejects.toBeInstanceOf(BadRequestError);
    })
})