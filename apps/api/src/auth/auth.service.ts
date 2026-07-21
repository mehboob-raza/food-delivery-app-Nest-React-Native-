import {
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as bcrypt from 'bcrypt';
import * as schema from '../db/schema';
import { JwtPayload } from '@food-delivery/types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('DB') private db: NeonHttpDatabase<typeof schema>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        //traditional way to check existing email. but it increases response time.
        // const [existing] = await this.db
        //     .select()
        //     .from(schema.users)
        //     .where(eq(schema.users.email, dto.email));

        // if (existing) throw new ConflictException('Email already in use');
        try {
            const hashedPassword = await bcrypt.hash(dto.password, 10);

            const [user] = await this.db
                .insert(schema.users)
                .values({
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    password: hashedPassword,
                    role: dto.role,
                })
                .returning();

            return {
                user: this.sanitizeUser(user),
                token: this.generateToken(user),
            };
        } catch (error: any) {
            if (error.code === '23505') {
                throw new ConflictException({
                    statusCode: 409,
                    message: 'Email already in use',
                    error: 'Conflict',
                });
            }
            throw error
        }

    }

    async login(dto: LoginDto) {
        const [user] = await this.db
            .select({
                id: schema.users.id,
                firstName: schema.users.firstName,
                lastName: schema.users.lastName,
                email: schema.users.email,
                password: schema.users.password,
                role: schema.users.role,
            })
            .from(schema.users)
            .where(eq(schema.users.email, dto.email))
            .limit(1);

        if (!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
    // async login(dto: LoginDto) {
    //     const [user] = await this.db
    //         .select()
    //         .from(schema.users)
    //         .where(eq(schema.users.email, dto.email));

    //     if (!user) throw new UnauthorizedException('Invalid Credentials');

    //     const passwordMatch = await bcrypt.compare(dto.password, user.password);

    //     if (!passwordMatch) throw new UnauthorizedException('Invalid Credentials');

    //     return {
    //         user: this.sanitizeUser(user),
    //         token: this.generateToken(user),
    //     };
    // }

    private generateToken(user: schema.NewUser) {
        const payload: JwtPayload = {
            sub: user.id!,
            email: user.email,
            role: user.role!,
        };
        return this.jwtService.sign(payload);
    }

    private sanitizeUser(user: schema.User) {
        const { password, ...safeUser } = user;
        void password;
        return safeUser;
    }
}