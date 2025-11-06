import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ClienteModule } from './cliente/cliente.module';
import { DireccionModule } from './direccion/direccion.module';
import { ProveedorModule } from './proveedor/proveedor.module';

@Module({
  imports: [UsuarioModule, ClienteModule, DireccionModule, ProveedorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
