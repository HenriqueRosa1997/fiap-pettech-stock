import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProduct } from './models/product.interface';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product implements IProduct {
  @Prop()
  name!: string;

  @Prop()
  quantity!: number;

  @Prop()
  relationId!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
