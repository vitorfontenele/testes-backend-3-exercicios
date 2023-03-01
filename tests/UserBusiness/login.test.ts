import { UserBusiness } from "../../src/business/UserBusiness"
import { LoginInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("login bem-sucedido em conta normal retorna token", async () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login bem-sucedido em conta admin retorna token", async () => {
        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: "bananinha"
        }

        const response = await userBusiness.login(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("email deve ser string", async () => {
        expect.assertions(1);

        const input: LoginInputDTO = {
            email: 1,
            password: "bananinha"
        }

        try {
            await userBusiness.login(input);
        } catch (error) {
           if (error instanceof BadRequestError) {
            expect(error.message).toBe("'email' deve ser string");
           }
        }
    })

    test("password deve ser string", async () => {
        expect.assertions(1);

        const input: LoginInputDTO = {
            email: "admin@email.com",
            password: 22
        }

        try {
            await userBusiness.login(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' deve ser string");
            }
        }
    })

    test("email não cadastrado", () => {
        const input: LoginInputDTO = {
            email: "johndoe@email.com",
            password: "password"
        }

        expect(async () => {
            await userBusiness.login(input)
        }).rejects.toBeInstanceOf(NotFoundError)
    })

    test("password incorreto", () => {
        const input: LoginInputDTO = {
            email: "normal@email.com",
            password: "PASSw03d"    
        }

        expect(async () => {
            await userBusiness.login(input)
        }).rejects.toThrow("'password' incorreto");
    })
})