import { vi, it, describe, expect, beforeEach, type Mocked} from 'vitest';
import { OwnerService } from './owner.service';
import type { OwnerRepository } from './owner.repository';
import { PasswordHash } from '../../utils/passwordHash';
import { repository } from './owner.route';

describe('OwnerService',()=>{
    let service: OwnerService;
  
    let mockRepository: Mocked<OwnerRepository>;

    beforeEach(() => {
    mockRepository = {
      getOwnerByCpf: vi.fn(),
      getOwnerByEmail: vi.fn(),
      createOwner: vi.fn(),
    } as unknown as Mocked<OwnerRepository>;

    service = new OwnerService(mockRepository);
    vi.restoreAllMocks();
    })

    //Create Owner ----------------------------------------------------------------
    it("should throw an error if the CPF is already registered", async ()=>{
        const payload = {
        name: "Dono Teste",
        cpf: "12345678900",
        email: "teste@email.com",
        phone: "+5581996676623",
        password: "senha123",
        }

        mockRepository.getOwnerByCpf.mockResolvedValue({id: "id-existente", ...payload, establishments:[]})

        await expect(service.createOwner(payload)).rejects.toThrow("CPF already exists");

        expect(mockRepository.createOwner).not.toHaveBeenCalled();
    })

    it("should throw an error if the email is already registered", async ()=>{
        const payload = {
        name: "Dono Teste",
        cpf: "12345678900",
        email: "teste@email.com",
        phone: "+5581996676623",
        password: "senha123",
        }

        mockRepository.getOwnerByCpf.mockResolvedValue(null);
        mockRepository.getOwnerByEmail.mockResolvedValue({id: "id-existente", ...payload, establishments:[]});

        await expect(service.createOwner(payload)).rejects.toThrow("Email already exists");

        expect(mockRepository.createOwner).not.toHaveBeenCalled();
    })

    it("It must encrypt the password and save the owner if the CPF and email are unique.", async ()=>{
        const payload = {
        name: "Dono Teste",
        cpf: "12345678900",
        email: "teste@email.com",
        phone: "+5581996676623",
        password: "senha123",
        }

        mockRepository.getOwnerByCpf.mockResolvedValue(null);
        mockRepository.getOwnerByEmail.mockResolvedValue(null);

        const spyHash = vi.spyOn(PasswordHash, "hashPassword").mockResolvedValue("senha_criptografada_mock");

        mockRepository.createOwner.mockResolvedValue({
            id: "id-criado",
            ...payload,
            password: "senha_criptografada_mock"});
        
            
        const result = await service.createOwner(payload);

        expect(spyHash).toHaveBeenCalledWith("senha123");

        expect(mockRepository.createOwner).toHaveBeenCalledWith({
            name: "Dono Teste",
            cpf: "12345678900",
            email: "teste@email.com",
            phone: "+5581996676623",
            password: "senha_criptografada_mock"
        })

        expect(result).toHaveProperty("id","id-criado");
    })

    //Login With Cpf ----------------------------------------------------------------

    it("should throw an error if the owner is not found", async ()=>{

        const payload = {
            emailOrCpf: "12345678900",
            password: "senha123"
        }

        mockRepository.getOwnerByCpf.mockResolvedValue(null);
  
        await expect(service.loginWithCpf(payload)).rejects.toThrow("Owner not found");
        
        expect(mockRepository.getOwnerByCpf).toHaveBeenCalledWith('12345678900');

    })

    it("should throw an error if the password is invalid", async ()=>{

        const payload = {
            emailOrCpf: "12345678900",
            password: "senha_errada_que_o_usuario_digitou"
        }

        const spyCompare = vi.spyOn(PasswordHash, "comparePassword").mockResolvedValue(false);
        
        mockRepository.getOwnerByCpf.mockResolvedValue({
            id: "owner-id-123",
            phone:"+5581996676623",
            email:"teste@email.com",
            password:"senha_criptografada_no_banco_123",
            name: "locolow",
            cpf: "12345678900",
            establishments: []});
  
        await expect(service.loginWithCpf(payload)).rejects.toThrow("Password is invalid");

        expect(spyCompare).toHaveBeenCalledWith(
            "senha_errada_que_o_usuario_digitou",
            "senha_criptografada_no_banco_123"
        )

    })

    it("It should compare the passwords and successfully find the user by cpf",async ()=>{
         const payload = {
            emailOrCpf: "12345678900",
            password: "senha123"
        }

        const spyCompare = vi.spyOn(PasswordHash, "comparePassword").mockResolvedValue(true);
        
        mockRepository.getOwnerByCpf.mockResolvedValue({
            id: "owner-id-123",
            phone:"+5581996676623",
            email:"teste@email.com",
            password:"senha_criptografada_no_banco_123",
            name: "locolow",
            cpf: "12345678900",
            establishments: []});
  
       
        const result = await service.loginWithCpf(payload);

        
        expect(mockRepository.getOwnerByCpf).toHaveBeenCalledWith('12345678900');
        expect(result).toHaveProperty("id","owner-id-123");
        expect(spyCompare).toHaveBeenCalledWith(
            "senha123",
            "senha_criptografada_no_banco_123"
        )

    })

    //Login With Email ----------------------------------------------------------------

    it("should throw an error if the owner is not found", async ()=>{
        const payload = {
            emailOrCpf: "teste@gmail.com",
            password: "senha123"
        }

        mockRepository.getOwnerByEmail.mockResolvedValue(null);
  
        await expect(service.loginWithEmail(payload)).rejects.toThrow("Owner not found");
        
        expect(mockRepository.getOwnerByEmail).toHaveBeenCalledWith('teste@gmail.com');
    })

    it("should throw an error if the password is invalid", async ()=>{

        const payload = {
            emailOrCpf: "teste@gmail.com",
            password: "senha_errada_que_o_usuario_digitou"
        }

        const spyCompare = vi.spyOn(PasswordHash, "comparePassword").mockResolvedValue(false);
        
        mockRepository.getOwnerByCpf.mockResolvedValue({
            id: "owner-id-123",
            phone:"+5581996676623",
            email:"teste@email.com",
            password:"senha_criptografada_no_banco_123",
            name: "locolow",
            cpf: "12345678900",
            establishments: []});
  
        await expect(service.loginWithCpf(payload)).rejects.toThrow("Password is invalid");

        expect(spyCompare).toHaveBeenCalledWith(
            "senha_errada_que_o_usuario_digitou",
            "senha_criptografada_no_banco_123"
        )

    })
    
    it("It should compare the passwords and successfully find the user by email",async ()=>{
         const payload = {
            emailOrCpf: "teste@email.com",
            password: "senha123"
        }

        const spyCompare = vi.spyOn(PasswordHash, "comparePassword").mockResolvedValue(true);
        
        mockRepository.getOwnerByEmail.mockResolvedValue({
            id: "owner-id-123",
            phone:"+5581996676623",
            email:"teste@email.com",
            password:"senha_criptografada_no_banco_123",
            name: "locolow",
            cpf: "12345678900",
            establishments: []});
  
       
        const result = await service.loginWithEmail(payload);

        
        expect(mockRepository.getOwnerByEmail).toHaveBeenCalledWith('teste@email.com');
        expect(result).toHaveProperty("id","owner-id-123");
        expect(spyCompare).toHaveBeenCalledWith(
            "senha123",
            "senha_criptografada_no_banco_123"
        )

    })

    
})