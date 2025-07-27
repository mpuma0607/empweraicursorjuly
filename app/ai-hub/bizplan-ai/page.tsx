import BizPlanForm from "@/components/biz-plan-form"

export default function BizPlanAIPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">BizPlan AI</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Create a personalized 90-day business plan with specific daily targets, prospecting strategies, and actionable
          steps to reach your financial goals.
        </p>
      </div>

      <BizPlanForm />
    </div>
  )
}
