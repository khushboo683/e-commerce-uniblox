import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserDto } from '../user/users.dto';
import { DiscountCouponStatus } from '../../common/constants/discount-coupon-status';
import { UserService } from '../user/user.service';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import { ConfigModule } from '@nestjs/config';
import { DiscountCouponModelHelperService } from '../model-helper/discount-coupon-model-helper/discount-coupon-model-helper.service';
import { ProductModelHelperService } from '../model-helper/product-model-helper/product-model-helper.service';
import { OrderModelHelperService } from '../model-helper/order-model-helper/order-model-helper.service';
import { ADMIN_MODEL, DISCOUNT_COUPON_MODEL, ORDER_MODEL, PRODUCT_MODEL, USER_MODEL } from '../../common/database/database.constants';
import { AuthService } from '../authentication/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AdminModelHelperService } from '../model-helper/admin-model-helper/admin-model-helper.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;
  const mockUserModel = {
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(), 
      ],
      controllers:[AdminController],
      providers: [
        AdminService,
        UserService,
        UserModelHelperService,
        DiscountCouponModelHelperService,
        ProductModelHelperService,
        OrderModelHelperService,
        AuthService,
        JwtService,
        AdminModelHelperService,
        {
          provide: USER_MODEL, 
          useValue: mockUserModel,
        },
        {
          provide: DISCOUNT_COUPON_MODEL, 
          useValue: mockUserModel,
        },
        {
          provide: PRODUCT_MODEL,
          useValue: mockUserModel,
        },
        {
          provide: ADMIN_MODEL,
          useValue: mockUserModel,
        },
        {
          provide: ORDER_MODEL, 
          useValue: mockUserModel,
        },
        
      ]
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserStats', () => {
    it('should return user stats', async () => {
      const userDto: UserDto = { mobile: '1234567890' };
      const expectedResult = {
        userStats :{ totalItemsPurchased: 5, totalAmount: 1000, totalDiscountSum:100 },
        discountCodes: [{ code: 'DISCOUNT10', status: DiscountCouponStatus.ACTIVE }],
      };

      jest.spyOn(service, 'getUserStats').mockResolvedValue(expectedResult);

      const result = await controller.getUserStats(userDto);

      expect(result).toEqual(expectedResult);
      expect(service.getUserStats).toHaveBeenCalledWith(userDto);
    });

    it('should throw an error if getUserStats fails', async () => {
      const userDto: UserDto = { mobile: '1234567890' };
      const error = new Error('Error fetching user stats');
      jest.spyOn(service, 'getUserStats').mockRejectedValue(error);

      await expect(controller.getUserStats(userDto)).rejects.toThrow(error);
      expect(service.getUserStats).toHaveBeenCalledWith(userDto);
    });
  });

  describe('generateDiscountCoupon', () => {
    it('should generate a discount coupon', async () => {
      const body: UserDto = { mobile: '1234567890' };
      const expectedResult = {   code: expect.any(String),
        userId: body.mobile,
        discountPercent: 10,
        status: DiscountCouponStatus.ACTIVE,
        expireAtOrder: 10,};

      jest.spyOn(service, 'generateCoupon').mockResolvedValue(expectedResult);

      const result = await controller.generateDiscountCoupon(body);

      expect(result).toEqual(expectedResult);
      expect(service.generateCoupon).toHaveBeenCalledWith(body);
    });

    it('should throw an error if generateCoupon fails', async () => {
      const userDto: UserDto = { mobile: '1234567890' };
      const error = new Error('Error fetching coupon');
      jest.spyOn(service, 'generateCoupon').mockRejectedValue(error);

      await expect(controller.generateDiscountCoupon(userDto)).rejects.toThrow(error);
      expect(service.generateCoupon).toHaveBeenCalledWith(userDto);
    });
  });
});
