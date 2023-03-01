import { UserBusiness } from "../../src/business/UserBusiness"
import { DeleteUserInputDTO } from "../../src/dtos/userDTO"
import { USER_ROLES } from "../../src/types"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("delete user", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("user deletado com sucesso", async () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-admin"
        } 

        const result = await userBusiness.deleteUser(input);

        expect(result).toBe("user deletado");
    })

    test("token é requerido", () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id",
            token: 1
        }

        expect(async () => {
            await userBusiness.deleteUser(input)
        }).rejects.toThrow("requer token");
    })

    test("token inválido", () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id",
            token: "fffkfjvndkfjvnfdk"
        }

        expect(async () => {
            await userBusiness.deleteUser(input)
        }).rejects.toThrow("token inválido");
    })

    test("somente admins podem deletar contas", () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock",
            token: "token-mock-normal"
        }

        expect(async () => {
            await userBusiness.deleteUser(input)
        }).rejects.toThrow("somente admins podem deletar contas")
    })

    test("id não existe", () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-que-nao-existe",
            token: "token-mock-admin"
        }

        expect(async () => {
            await userBusiness.deleteUser(input)
        }).rejects.toThrow("'id' não existe")
    })
})