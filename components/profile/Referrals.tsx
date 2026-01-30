import { View } from "react-native";
import ReferralCard from "./ReferralCard";

export default function Referrals() {
  return (
    <View>
      <ReferralCard
        name="Sneha Kapoor"
        subtitle="Joined on March 8, 2023"
        avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=sneha"
        onActionPress={() => {}}
      />
    </View>
  );
}
