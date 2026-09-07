import jwt from 'jsonwebtoken';


export class TokenService {

    static generateToken(payload: any){
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: '1h'})
        return token;
    }

    static verifyToken(token: string){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}