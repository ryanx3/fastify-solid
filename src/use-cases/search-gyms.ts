import type { GymsRepository } from "@/repositories/gyms-repository";
import type { Gym } from "generated/prisma";

interface SearchGymsUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private prismaGymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.prismaGymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
