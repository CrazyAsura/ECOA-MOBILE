import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Complaint } from '../../complaints/entities/complaint.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Complaint)
    private readonly complaintRepo: Repository<Complaint>,
  ) {}

  private visits = [];

  logVisit(visitData: { path: string; userAgent: string; ip: string }) {
    const visit = { ...visitData, timestamp: new Date() };
    this.visits.push(visit);
    console.log(`[Activity Log] User entered: ${visit.path} | IP: ${visit.ip}`);
    return { success: true };
  }

  async getStats() {
    const [totalUsers, complaintsData] = await Promise.all([
      this.userRepo.count(),
      this.complaintRepo.find({ order: { createdAt: 'DESC' }, take: 5 }),
    ]);

    const totalComplaints = await this.complaintRepo.count();

    return {
      totalUsers,
      totalComplaints,
      recentComplaints: complaintsData,
      totalVisits: this.visits.length,
    };
  }
}
