import { UserBusiness } from "../../src/business/UserBusiness"
import { GetByIdInputDTO } from "../../src/dtos/userDTO"
import { USER_ROLES } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("getById", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("pega usuario com sucesso", async () => {
        const input: GetByIdInputDTO = {
            idToFind: "id-mock-normal"
        }

        const response = await userBusiness.getById(input);

        const expectedResponse = {
            id: "id-mock-normal",
            name: "Normal Mock",
            email: "normal@email.com",
            password: "hash-bananinha",
            createdAt: expect.any(String),
            role: USER_ROLES.NORMAL
        }

        expect(response.user).toEqual(expectedResponse);
    })

    test("id não existe", () => {
        const input: GetByIdInputDTO = {
            idToFind: "id-que-nao-existe"
        }

        expect(async () => {
            await userBusiness.getById(input)
        }).rejects.toThrow("'id' não existe");
    })
})