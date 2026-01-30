import SubmissionCard from "@/components/submission-card";
import { View } from "react-native";

export default function ProfileActivity() {
  return (
    <View>
      <SubmissionCard
        title="Glossier"
        description="Leave your Glossier Product review on social media, whatever platforms you have"
        image={require("@/assets/images/weekly-vibe.png")}
        responses={247}
        points={10}
      />
    </View>
  );
}
