import { ConnectionError } from "../../../../../src/core/errors/errors";
import { Session } from "../../../../../src/features/login/domain/entities/session";
import { LoginRepositoryContract } from "../../../../../src/features/login/domain/repositories/login_repository_contract";
import { Logout } from "../../../../../src/features/login/domain/usecases/logout";

class MockLoginRepository implements LoginRepositoryContract {
  getSessionById: (idSession: number) => Promise<Session>;
  getUserForLogin = jest.fn();
  saveSession = jest.fn();
  deleteSession = jest.fn();
}

describe("Test Logout Usecase", () => {
  var tIdSession: number = 0;
  var mockLoginRepository: MockLoginRepository;
  var sut: Logout;

  beforeEach(() => {
    mockLoginRepository = new MockLoginRepository();
    sut = new Logout(mockLoginRepository);
  });

  it("should call deleteSession from loginRepository passing correct parameters", async () => {
    await sut.execute(tIdSession);

    expect(mockLoginRepository.deleteSession).toHaveBeenCalledWith(tIdSession);
  });

  it("if deleteSession throws ConnectionError should rethrow", async () => {
    mockLoginRepository.deleteSession.mockImplementation(() => {
      throw new ConnectionError();
    });

    await expect(sut.execute(tIdSession)).rejects.toThrow(ConnectionError);
  });
});
