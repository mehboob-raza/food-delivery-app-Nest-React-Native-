import { api } from '@lib/axios'
import { useQuery } from '@tanstack/react-query'
import { HealthCheckResponse } from '@food-delivery/types'
import { ActivityIndicator, Text, View } from 'react-native'


export default function HomeScreen() {
  const { data: health, isLoading, error } = useQuery<HealthCheckResponse>({
    queryKey: ['health'],
    queryFn: () => api.get<HealthCheckResponse>('/health').then((res) => res.data)
  })



  return (
    <View>
      <Text>FOOD DELIVERY</Text>
      <Text>Connection Text</Text>
      {isLoading && <ActivityIndicator size='large' color='#ff6b35' />}

      {
        health && (
          <View>
            <Text> API Status : {health.status}</Text>
            <Text>
              {new Date(health.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )
      }

      {
        error && (
          <View>
            <Text>Could not reach the API. Is the server runnig?</Text>
            <Text>Could not reach the API. Is the server runnig?</Text>
            <Text>Could not reach the API. Is the server runnig?</Text>
            <Text>Could not reach the API. Is the server runnig?</Text>
            <Text>Could not reach the API. Is the server runnig?</Text>
          </View>
        )
      }
    </View>
  )
}