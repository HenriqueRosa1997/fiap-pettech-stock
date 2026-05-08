import { IProduct } from 'src/stock/schemas/models/product.interface';
import { ProductRepository } from '../product.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/stock/schemas/product.schema';
import { Model } from 'mongoose';

export class ProductMongooseRepository implements ProductRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  getAllStock(limit: number, page: number): Promise<IProduct[]> {
    const offset = (page - 1) * limit;
    return this.productModel.find().skip(offset).limit(limit).lean().exec();
  }

  getStock(productId: string): Promise<IProduct | null> {
    return this.productModel.findById(productId).lean().exec();
  }

  async createStock(product: IProduct): Promise<void> {
    const createStock = new this.productModel(product);

    await createStock.save();
  }
  async updateStock(
    productId: string,
    data: Partial<IProduct>,
  ): Promise<IProduct | null> {
    const result = await this.productModel.updateOne(
      { _id: productId },
      { $set: data },
    );

    console.log('UPDATE RESULT:', result);

    return this.productModel.findById(productId).lean().exec();
  }
  async deleteStock(productId: string): Promise<void> {
    await this.productModel.deleteOne({ _id: productId }).exec();
  }
}
