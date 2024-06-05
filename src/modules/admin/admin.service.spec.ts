import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/users.dto';
import { UserModelHelperService } from '../model-helper/user-model-helper/user-model-helper.service';
import { DiscountCouponModelHelperService } from '../model-helper/discount-coupon-model-helper/discount-coupon-model-helper.service';
import { DiscountCouponStatus } from '../../common/constants/discount-coupon-status';
import { BadRequestException } from '@nestjs/common';
import { Roles } from '../../common/constants/roles';
import { ProductModelHelperService } from '../model-helper/product-model-helper/product-model-helper.service';
import { OrderModelHelperService } from '../model-helper/order-model-helper/order-model-helper.service';
import { ConfigModule } from '@nestjs/config';
import { USER_MODEL, DISCOUNT_COUPON_MODEL, PRODUCT_MODEL, ADMIN_MODEL, ORDER_MODEL } from '../../common/database/database.constants';
import { AdminController } from './admin.controller';

describe('AdminService', () => {
  let service: AdminService;
  let userService: UserService;
  let userModelHelper: UserModelHelperService;
  let discountCouponModelHelper: DiscountCouponModelHelperService
  const mockUserModel = {
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(), 
      ],
      providers: [
        AdminService,
        UserService,
        UserModelHelperService,
        DiscountCouponModelHelperService,
        ProductModelHelperService,
        OrderModelHelperService,
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

    service = module.get<AdminService>(AdminService);
    userService = module.get<UserService>(UserService);
    userModelHelper=module.get<UserModelHelperService>(UserModelHelperService);
    discountCouponModelHelper=module.get<DiscountCouponModelHelperService>(DiscountCouponModelHelperService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUserStats', () => {
    it('should return user stats and discount codes', async () => {
      const userDto: UserDto = { mobile: '1234567890' };
      const userStats = { totalItemsPurchased: 5, totalAmount: 1000, totalDiscountSum:100 };
      const discountCodes= [{ code: 'DISCOUNT10', status: DiscountCouponStatus.ACTIVE }];

      jest.spyOn(userModelHelper, 'getUserStats').mockResolvedValue(userStats);
      jest.spyOn(discountCouponModelHelper, 'fetchCouponStats').mockResolvedValue(discountCodes);

      const result = await service.getUserStats(userDto);

      expect(result).toEqual({
        userStats,
        discountCodes,
      });
      expect(userModelHelper.getUserStats).toHaveBeenCalledWith(userDto.mobile);
      expect(discountCouponModelHelper.fetchCouponStats).toHaveBeenCalledWith(
        { userId: userDto.mobile },
        { code: 1, status: 1 }
      );
    });

    it('should throw an error if getUserStats fails', async () => {
      const userDto: UserDto = { mobile: '1234567890' };
      jest.spyOn(userModelHelper, 'getUserStats').mockRejectedValue(new Error('Error fetching user stats'));

      await expect(service.getUserStats(userDto)).rejects.toThrow('Error fetching user stats');
    });

    it('should throw an error if fetchCouponStats fails', async () => {
      const userDto: UserDto = { mobile: '1234567890' };
      const userStats = { totalItemsPurchased: 5, totalAmount: 1000, totalDiscountSum:100 };
      
      jest.spyOn(userModelHelper, 'getUserStats').mockResolvedValue(userStats);
      jest.spyOn(discountCouponModelHelper, 'fetchCouponStats').mockRejectedValue(new Error('Error fetching coupon stats'));

      await expect(service.getUserStats(userDto)).rejects.toThrow('Error fetching coupon stats');
    });
  });
  describe('generateCoupon', () => {
    it('should generate a coupon when the user is eligible', async () => {
      const body = { mobile: '1234567890' };
      const user = { 
        orders: new Array(4).fill({}),
        cart: {
         productList:new Array(4).fill({}),
         cartValue:20
        },
        name:"khushboo",
        mobile:"1234567890",
        email:"example123.com",
        password:"1234",role:Roles.USER };
      const couponObj = {
        code: expect.any(String),
        userId: body.mobile,
        discountPercent: 10,
        status: DiscountCouponStatus.ACTIVE,
        expireAtOrder: 10,
      };

      jest.spyOn(userModelHelper, 'findUserWithMobile').mockResolvedValue(user);
      jest.spyOn(discountCouponModelHelper, 'createDiscountCoupon').mockResolvedValue(couponObj);

      const result = await service.generateCoupon(body);

      expect(result).toEqual(couponObj);
      expect(userModelHelper.findUserWithMobile).toHaveBeenCalledWith(body.mobile);
      expect(discountCouponModelHelper.createDiscountCoupon).toHaveBeenCalledWith(expect.objectContaining({
        code: expect.any(String),
        userId: body.mobile,
        discountPercent: 10,
        status: DiscountCouponStatus.ACTIVE,
        expireAtOrder: 10,
      }));
    });

    it('should throw an error when the user is not eligible for a discount coupon', async () => {
      const body = { mobile: '1234567890' };
      const user = { 
        orders: new Array(5).fill({}),
        cart: {
         productList:new Array(4).fill({}),
         cartValue:20
        },
        name:"khushboo",
        mobile:"1234567890",
        email:"example123.com",
        password:"1234",role:Roles.USER };

      jest.spyOn(userModelHelper, 'findUserWithMobile').mockResolvedValue(user);

      await expect(service.generateCoupon(body)).rejects.toThrow(BadRequestException);
      expect(userModelHelper.findUserWithMobile).toHaveBeenCalledWith(body.mobile);
    });

    it('should throw an error when the user is not found', async () => {
      const body = { mobile: '1234567890' };

      jest.spyOn(userModelHelper, 'findUserWithMobile').mockResolvedValue(null);

      await expect(service.generateCoupon(body)).rejects.toThrow(BadRequestException);
      expect(userModelHelper.findUserWithMobile).toHaveBeenCalledWith(body.mobile);
    });
  });

});
