import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { DesignationsService } from '../designations/designations.service';

@Injectable()
export class SyncDesignationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private designationsService: DesignationsService,
  ) {}

  /**
   * Syncs the user's designation with the employee's designation
   * This ensures that the user has the correct designation for permission checks
   */
  async syncUserDesignation(userId: string, designationName: string): Promise<void> {
    try {
      // Find the designation by name
      const designation = await this.designationsService.findByName(designationName);
      
      if (!designation) {
        console.log(`Designation '${designationName}' not found, skipping user designation sync`);
        return;
      }
      
      // Update the user's designation
      await this.userRepository.update(
        { id: userId },
        { designationId: designation.id }
      );
      
      console.log(`Updated user ${userId} with designation ${designation.id} (${designationName})`);
    } catch (error) {
      console.error('Error syncing user designation:', error);
      // Don't throw the error to avoid disrupting the main flow
    }
  }
}
