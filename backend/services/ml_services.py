"""
ML Services for MathPulse AI
Integrates with Hugging Face for AI-powered educational features
"""
import json
import re
import os
import sys
from typing import Optional

from huggingface_hub import InferenceClient

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import config


class HuggingFaceService:
    """Service for interacting with Hugging Face Inference API using official library"""
    
    def __init__(self):
        self.client = InferenceClient(token=config.HUGGINGFACE_API_TOKEN)
    
    async def query_chat(self, model_id: str, messages: list, max_tokens: int = 300) -> dict:
        """Send a chat completion request to a Hugging Face model"""
        print(f"🔄 Calling HuggingFace Chat API: {model_id}")
        
        try:
            response = self.client.chat_completion(
                model=model_id,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7,
            )
            
            print(f"✅ HuggingFace Response received successfully")
            
            # Extract the response content
            if response.choices and len(response.choices) > 0:
                content = response.choices[0].message.content
                return {"generated_text": content}
            
            return {"error": "No response generated"}
            
        except Exception as e:
            print(f"❌ HuggingFace Exception: {str(e)}")
            return {"error": str(e)}
    
    async def query_classification(self, model_id: str, text: str, labels: list):
        """Send a zero-shot classification request"""
        print(f"🔄 Calling HuggingFace Classification API: {model_id}")
        
        try:
            response = self.client.zero_shot_classification(
                text=text,
                candidate_labels=labels,
                model=model_id
            )
            
            print(f"✅ HuggingFace Classification received")
            return response
            
        except Exception as e:
            print(f"❌ HuggingFace Classification Exception: {str(e)}")
            return {"error": str(e)}


class AITutorService:
    """AI Tutor for math education - uses LLM for conversational help"""
    
    def __init__(self):
        self.hf_service = HuggingFaceService()
        self.model_id = config.CHAT_MODEL_ID
        self.system_prompt = """You are MathPulse AI, a friendly and encouraging math tutor for high school students.
Your role is to:
- Help students understand mathematical concepts step by step
- Provide clear explanations using simple language
- Give examples when helpful
- Encourage students and praise their efforts
- Focus on building intuition, not just memorization
- If a student is struggling, break problems into smaller steps

Current topic focus: Calculus and Derivatives
Keep responses concise but helpful (2-3 paragraphs max)."""

    async def get_response(self, user_message: str, conversation_history: list | None = None) -> str:
        """Generate a response from the AI tutor"""
        
        # Build the messages for chat completion
        messages = [{"role": "system", "content": self.system_prompt}]
        
        if conversation_history:
            for msg in conversation_history[-5:]:  # Last 5 messages for context
                role = "user" if msg.get("sender") == "user" else "assistant"
                messages.append({"role": role, "content": msg.get("message", "")})
        
        messages.append({"role": "user", "content": user_message})
        
        # Call the HuggingFace chat API
        result = await self.hf_service.query_chat(self.model_id, messages)
        
        if "error" in result:
            # Fallback response if API fails - pass history for context-aware fallback
            return self._get_fallback_response(user_message, conversation_history)
        
        # Extract generated text
        generated = result.get("generated_text", "")
        if generated:
            return generated
        
        return self._get_fallback_response(user_message, conversation_history)
    
    def _get_fallback_response(self, user_message: str, conversation_history: list | None = None) -> str:
        """Provide a context-aware fallback response when API is unavailable"""
        user_input = user_message.lower().strip()
        
        # ============ STEP 1: Analyze conversation context ============
        context = self._analyze_conversation_context(conversation_history)
        
        # ============ STEP 2: Classify user intent ============
        intent = self._classify_user_intent(user_input, context)
        
        # ============ STEP 3: Handle based on intent ============
        
        # Handle affirmative/continuation responses (yes, sure, okay, etc.)
        if intent == "affirmative":
            return self._handle_affirmative_response(context)
        
        # Handle requests for more examples
        if intent == "want_examples":
            return self._get_examples_for_topic(context.get("current_topic", "derivatives"))
        
        # Handle requests for practice problems
        if intent == "want_practice":
            return self._get_practice_problem(context.get("current_topic", "derivatives"))
        
        # Handle clarification requests
        if intent == "need_clarification":
            return self._clarify_topic(context.get("current_topic"), user_input)
        
        # Handle gratitude
        if intent == "gratitude":
            return self._handle_gratitude(context)
        
        # Handle new topic questions
        if intent == "new_question":
            return self._handle_new_question(user_input)
        
        # Default: try to be helpful based on context
        if context.get("current_topic"):
            return f"I see you're working on {context['current_topic']}. What specific aspect would you like me to help with? I can explain concepts, show examples, or give you practice problems."
        
        return "I'm here to help with math! What topic would you like to explore? I can help with derivatives, integrals, limits, trigonometry, algebra, and more."
    
    def _analyze_conversation_context(self, history: list | None) -> dict:
        """Extract context from conversation history"""
        context = {
            "current_topic": None,
            "last_ai_offer": None,
            "last_user_question": None,
            "topics_discussed": [],
            "examples_given": False,
            "practice_offered": False
        }
        
        if not history:
            return context
        
        # Topic keywords to detect
        topic_keywords = {
            "derivatives": ["derivative", "differentiate", "differentiation", "d/dx", "f'(x)", "rate of change", "slope", "tangent"],
            "chain_rule": ["chain rule", "composite", "inside function", "outside function"],
            "integrals": ["integral", "integrate", "integration", "antiderivative", "area under"],
            "limits": ["limit", "approaches", "lim", "infinity", "continuous"],
            "quadratic": ["quadratic", "parabola", "factoring", "quadratic formula", "x²", "ax² + bx"],
            "trigonometry": ["trig", "sin", "cos", "tan", "sine", "cosine", "tangent", "unit circle"],
            "algebra": ["equation", "solve for", "variable", "expression", "simplify"],
            "logarithms": ["log", "logarithm", "ln", "natural log", "exponential"]
        }
        
        # Analyze all messages
        for msg in history:
            message_text = msg.get("message", "").lower()
            sender = msg.get("sender", "")
            
            # Detect topics
            for topic, keywords in topic_keywords.items():
                if any(kw in message_text for kw in keywords):
                    if topic not in context["topics_discussed"]:
                        context["topics_discussed"].append(topic)
                    context["current_topic"] = topic
            
            # Track AI offers
            if sender == "ai":
                if "would you like" in message_text or "want me to" in message_text:
                    if "example" in message_text:
                        context["last_ai_offer"] = "examples"
                    elif "practice" in message_text or "try" in message_text:
                        context["last_ai_offer"] = "practice"
                    elif "explain" in message_text:
                        context["last_ai_offer"] = "explanation"
                    elif "step" in message_text:
                        context["last_ai_offer"] = "steps"
                    else:
                        context["last_ai_offer"] = "continue"
                
                if "example" in message_text and (":" in message_text or "•" in message_text):
                    context["examples_given"] = True
            
            # Track user questions
            if sender == "user" and ("?" in message_text or any(q in message_text for q in ["what", "how", "why", "when", "can you", "could you"])):
                context["last_user_question"] = message_text
        
        return context
    
    def _classify_user_intent(self, user_input: str, context: dict) -> str:
        """Classify what the user wants based on their message and context"""
        
        # Affirmative responses (agreeing to AI's offer)
        affirmative_patterns = [
            "yes", "yeah", "yep", "yup", "sure", "ok", "okay", "k", "alright",
            "go ahead", "please", "please do", "yes please", "sure thing",
            "sounds good", "let's do it", "i would", "i'd like", "definitely",
            "absolutely", "of course", "why not", "let's go", "ready"
        ]
        
        # Check for exact or near-exact matches for short affirmative responses
        if user_input in affirmative_patterns or any(user_input.startswith(p) for p in affirmative_patterns):
            if context.get("last_ai_offer"):
                return "affirmative"
        
        # Requests for examples
        example_patterns = ["example", "show me", "demonstrate", "like what", "such as", "for instance", "can you show"]
        if any(p in user_input for p in example_patterns):
            return "want_examples"
        
        # Requests for practice
        practice_patterns = ["practice", "try", "exercise", "problem", "quiz", "test me", "let me try"]
        if any(p in user_input for p in practice_patterns):
            return "want_practice"
        
        # Clarification requests
        clarify_patterns = ["don't understand", "confused", "what do you mean", "not sure", "can you explain", 
                          "i don't get", "still confused", "clarify", "what is", "how does", "why is"]
        if any(p in user_input for p in clarify_patterns):
            return "need_clarification"
        
        # Gratitude
        gratitude_patterns = ["thanks", "thank you", "thx", "ty", "appreciate", "helpful", "got it", "makes sense", "i see", "understood"]
        if any(p in user_input for p in gratitude_patterns):
            return "gratitude"
        
        # New questions (longer messages or question words)
        if len(user_input) > 30 or "?" in user_input or any(q in user_input for q in ["what", "how", "why", "when", "find", "calculate", "solve"]):
            return "new_question"
        
        return "unknown"
    
    def _handle_affirmative_response(self, context: dict) -> str:
        """Handle when user agrees to AI's offer"""
        offer = context.get("last_ai_offer")
        topic = context.get("current_topic", "derivatives")
        
        if offer == "examples":
            return self._get_examples_for_topic(topic)
        elif offer == "practice":
            return self._get_practice_problem(topic)
        elif offer == "explanation":
            return self._get_detailed_explanation(topic)
        elif offer == "steps":
            return self._get_step_by_step(topic)
        else:
            # Default: give more examples for the current topic
            return self._get_examples_for_topic(topic)
    
    def _get_examples_for_topic(self, topic: str) -> str:
        """Get examples based on the current topic"""
        if topic in ["derivatives", None]:
            return self._get_derivative_examples()
        elif topic == "chain_rule":
            return self._get_chain_rule_examples()
        elif topic == "integrals":
            return self._get_integral_examples()
        elif topic == "limits":
            return self._get_limit_examples()
        elif topic == "quadratic":
            return self._get_quadratic_examples()
        elif topic == "trigonometry":
            return self._get_trig_examples()
        else:
            return self._get_derivative_examples()
    
    def _get_practice_problem(self, topic: str) -> str:
        """Generate a practice problem for the topic"""
        problems = {
            "derivatives": """Let's practice! Try finding the derivative of:

**Problem:** f(x) = 3x⁴ - 2x² + 5x - 1

**Hint:** Use the power rule on each term: d/dx[xⁿ] = n·xⁿ⁻¹

Take your time and let me know your answer! I'll help you check it.""",
            
            "chain_rule": """Let's practice the chain rule! Find the derivative of:

**Problem:** f(x) = (x² + 3)⁵

**Hint:** Identify the outer function (u⁵) and inner function (u = x² + 3), then apply: f'(x) = outer' × inner'

What do you get?""",
            
            "integrals": """Time to practice integration! Find:

**Problem:** ∫(4x³ - 6x + 2) dx

**Hint:** Integrate each term separately using the power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C

Give it a try!""",
            
            "limits": """Let's practice evaluating limits! Find:

**Problem:** lim(x→2) (x² - 4)/(x - 2)

**Hint:** Direct substitution gives 0/0, so try factoring the numerator first!

What answer do you get?"""
        }
        return problems.get(topic, problems["derivatives"])
    
    def _get_detailed_explanation(self, topic: str) -> str:
        """Provide detailed explanation of a topic"""
        explanations = {
            "derivatives": """Let me explain derivatives in more depth:

**What is a derivative?**
The derivative tells us how fast a function is changing at any point. Imagine you're driving a car - your speedometer shows your "instantaneous rate of change" of position. That's exactly what a derivative measures!

**Mathematically:**
f'(x) = lim(h→0) [f(x+h) - f(x)] / h

**Key Rules:**
1. **Power Rule:** d/dx[xⁿ] = n·xⁿ⁻¹
2. **Constant Rule:** d/dx[c] = 0
3. **Sum Rule:** d/dx[f + g] = f' + g'
4. **Constant Multiple:** d/dx[c·f] = c·f'

Would you like to see these rules applied to specific problems?""",
            
            "chain_rule": """Let me break down the chain rule step by step:

**When to use it:** When you have a function "inside" another function, like sin(x²) or (2x+1)³

**The Formula:** If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x)

**Think of it as:**
"Derivative of outside (keeping inside the same) × Derivative of inside"

**Example walkthrough:** f(x) = (x² + 1)³
1. Outside: u³ → derivative: 3u²
2. Inside: u = x² + 1 → derivative: 2x
3. Combine: 3(x² + 1)² · 2x = 6x(x² + 1)²

Want to try one together?"""
        }
        return explanations.get(topic, explanations["derivatives"])
    
    def _get_step_by_step(self, topic: str) -> str:
        """Provide step-by-step solution method"""
        return self._get_detailed_explanation(topic)
    
    def _clarify_topic(self, topic: str | None, user_input: str) -> str:
        """Clarify based on what confused the user"""
        if topic == "derivatives":
            return """No worries! Let me explain it differently.

**Think of derivatives like this:**
If you have a curve, the derivative at any point tells you the "steepness" of that curve.

- If derivative > 0: curve is going UP ↗
- If derivative < 0: curve is going DOWN ↘  
- If derivative = 0: curve is FLAT (could be a peak or valley)

**Simple example:**
f(x) = x² is a parabola (U-shape)
f'(x) = 2x tells us:
- At x = -2: slope = -4 (steep downward)
- At x = 0: slope = 0 (bottom of the U)
- At x = 2: slope = 4 (steep upward)

Does this help? What part is still unclear?"""
        
        return "I want to make sure you understand! Can you tell me specifically what part is confusing? I'll explain it a different way."
    
    def _handle_gratitude(self, context: dict) -> str:
        """Respond to thank you messages"""
        topic = context.get("current_topic", "math")
        
        responses = [
            f"You're welcome! You're making great progress with {topic}. Would you like to try a practice problem to solidify your understanding?",
            f"Happy to help! Keep practicing {topic} and it'll become second nature. Ready for another example or want to try something new?",
            f"Glad I could help! Is there anything else about {topic} you'd like to explore, or shall we move on to a related concept?"
        ]
        import random
        return random.choice(responses)
    
    def _handle_new_question(self, user_input: str) -> str:
        """Handle a new topic question"""
        keywords = user_input.lower()
        
        if "derivative" in keywords or "differentiate" in keywords:
            return "The derivative measures how a function changes as its input changes. Think of it as the 'instantaneous rate of change' or the slope of the tangent line at any point. For example, if f(x) = x², then f'(x) = 2x. Would you like me to walk through more examples?"
        
        if "chain rule" in keywords:
            return "The chain rule is used when you have a function inside another function (composition). If y = f(g(x)), then dy/dx = f'(g(x)) × g'(x). Think of it as 'derivative of the outside × derivative of the inside'. What specific problem are you working on?"
        
        if "integral" in keywords or "integrate" in keywords:
            return "Integration is the reverse of differentiation. While derivatives give us rates of change, integrals help us find areas under curves and accumulate quantities. The basic rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. What would you like to integrate?"
        
        if "limit" in keywords:
            return "Limits describe what value a function approaches as the input gets closer to some value. We write it as lim(x→a) f(x) = L. Limits are the foundation of calculus - they help us define derivatives and integrals precisely. What limit are you trying to solve?"
        
        if "quadratic" in keywords:
            return "Quadratic equations have the form ax² + bx + c = 0. You can solve them by factoring, completing the square, or using the quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Which method would you like to learn?"
        
        return "Great question! I'm here to help you understand math concepts. Could you tell me more about what you're working on? I can help with calculus (derivatives, integrals, limits), algebra, trigonometry, and more."
    
    def _get_quadratic_examples(self) -> str:
        """Provide quadratic equation examples"""
        return """Here are quadratic equation examples:

**Method 1: Factoring**
x² - 5x + 6 = 0
(x - 2)(x - 3) = 0
x = 2 or x = 3

**Method 2: Quadratic Formula**
For ax² + bx + c = 0: x = (-b ± √(b²-4ac)) / 2a

Example: 2x² + 5x - 3 = 0
x = (-5 ± √(25+24)) / 4 = (-5 ± 7) / 4
x = 0.5 or x = -3

**Method 3: Completing the Square**
x² + 6x + 5 = 0
x² + 6x + 9 = 4  (add 4 to both sides)
(x + 3)² = 4
x + 3 = ±2
x = -1 or x = -5

Would you like to practice solving one?"""

    def _get_trig_examples(self) -> str:
        """Provide trigonometry examples"""
        return """Here are key trigonometry concepts:

**Unit Circle Values (memorize these!):**
• sin(0°) = 0, cos(0°) = 1
• sin(30°) = 1/2, cos(30°) = √3/2
• sin(45°) = √2/2, cos(45°) = √2/2
• sin(60°) = √3/2, cos(60°) = 1/2
• sin(90°) = 1, cos(90°) = 0

**Key Identities:**
• sin²θ + cos²θ = 1
• tan θ = sin θ / cos θ
• sin(2θ) = 2 sin θ cos θ

**Derivatives:**
• d/dx[sin x] = cos x
• d/dx[cos x] = -sin x
• d/dx[tan x] = sec² x

Want to work through a specific trig problem?"""

    def _get_derivative_examples(self) -> str:
        """Provide more derivative examples for follow-up questions"""
        return """Great! Here are more derivative examples:

**Power Rule:** If f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹
• f(x) = x³ → f'(x) = 3x²
• f(x) = x⁵ → f'(x) = 5x⁴

**Constant Multiple:** If f(x) = c·g(x), then f'(x) = c·g'(x)
• f(x) = 4x² → f'(x) = 8x

**Sum Rule:** The derivative of a sum is the sum of derivatives
• f(x) = x³ + 2x → f'(x) = 3x² + 2

Would you like to try a practice problem, or should I explain the chain rule next?"""

    def _get_chain_rule_examples(self) -> str:
        """Provide more chain rule examples"""
        return """Here are step-by-step chain rule examples:

**Example 1:** f(x) = (2x + 1)³
• Outer function: u³, Inner function: u = 2x + 1
• f'(x) = 3(2x + 1)² × 2 = 6(2x + 1)²

**Example 2:** f(x) = sin(x²)
• Outer: sin(u), Inner: u = x²
• f'(x) = cos(x²) × 2x = 2x·cos(x²)

**Example 3:** f(x) = √(3x - 5) = (3x - 5)^(1/2)
• f'(x) = (1/2)(3x - 5)^(-1/2) × 3 = 3/(2√(3x - 5))

Want to try one yourself? How about finding the derivative of (x² + 1)⁴?"""

    def _get_integral_examples(self) -> str:
        """Provide more integration examples"""
        return """Here are integration examples using the power rule:

**Power Rule for Integrals:** ∫xⁿ dx = xⁿ⁺¹/(n+1) + C

**Examples:**
• ∫x² dx = x³/3 + C
• ∫x⁴ dx = x⁵/5 + C
• ∫1/x² dx = ∫x⁻² dx = -1/x + C

**With constants:**
• ∫3x² dx = 3 · x³/3 + C = x³ + C
• ∫(2x + 5) dx = x² + 5x + C

Remember: Always add the constant C for indefinite integrals! Would you like to explore definite integrals or integration by substitution?"""

    def _get_limit_examples(self) -> str:
        """Provide more limit examples"""
        return """Here are more limit examples:

**Direct Substitution (when possible):**
• lim(x→2) (x² + 3) = 4 + 3 = 7

**When you get 0/0 (indeterminate form), try factoring:**
• lim(x→3) (x² - 9)/(x - 3)
• = lim(x→3) (x+3)(x-3)/(x-3)
• = lim(x→3) (x + 3) = 6

**Limits at infinity:**
• lim(x→∞) (3x² + 2)/(x² - 1) = 3 (compare highest powers)

**Important limit:**
• lim(x→0) sin(x)/x = 1 (this one you just memorize!)

Would you like to practice evaluating some limits together?"""


class RiskPredictionService:
    """Predicts student risk levels using ML-based analysis"""
    
    def __init__(self):
        self.hf_service = HuggingFaceService()
        self.model_id = config.CLASSIFICATION_MODEL_ID
    
    async def predict_risk(self, student_data: dict) -> dict:
        """
        Predict risk level for a student based on their metrics
        
        Args:
            student_data: Dict containing engagementScore, avgQuizScore, etc.
        
        Returns:
            Risk assessment with level and confidence
        """
        # Build a description of the student's performance for classification
        engagement = student_data.get("engagementScore", 50)
        quiz_score = student_data.get("avgQuizScore", 50)
        weakest_topic = student_data.get("weakestTopic", "Unknown")
        
        # Create a text description for zero-shot classification
        student_description = f"""
        Student performance profile:
        - Average quiz score: {quiz_score}%
        - Engagement score: {engagement}%
        - Struggling with: {weakest_topic}
        """
        
        labels = ["high risk of academic failure", "moderate risk needs support", "low risk performing well"]
        
        result = await self.hf_service.query_classification(self.model_id, student_description, labels)
        
        # Check if result is a dict with error key
        if isinstance(result, dict) and "error" in result:
            # Fallback to rule-based prediction
            return self._rule_based_prediction(engagement, quiz_score, weakest_topic)
        
        # Parse classification result from huggingface_hub format
        try:
            # The result is a list of ClassificationOutputElement objects
            if result and isinstance(result, list) and len(result) > 0:
                top_result = result[0]
                top_label = getattr(top_result, 'label', str(top_result))
                confidence = getattr(top_result, 'score', 0.5)
                
                risk_level = "High" if "high" in top_label else "Medium" if "moderate" in top_label else "Low"
                
                return {
                    "riskLevel": risk_level,
                    "confidence": round(confidence * 100, 1),
                    "analysis": self._generate_analysis(risk_level, engagement, quiz_score, weakest_topic),
                    "factors": self._identify_risk_factors(engagement, quiz_score)
                }
        except Exception as e:
            print(f"⚠️ Classification parse error: {e}")
        
        return self._rule_based_prediction(engagement, quiz_score, weakest_topic)
    
    def _rule_based_prediction(self, engagement: float, quiz_score: float, weakest_topic: str) -> dict:
        """Fallback rule-based risk prediction"""
        combined_score = (engagement + quiz_score) / 2
        
        if combined_score < 55:
            risk_level = "High"
            confidence = 85.0
        elif combined_score < 75:
            risk_level = "Medium"
            confidence = 75.0
        else:
            risk_level = "Low"
            confidence = 80.0
        
        return {
            "riskLevel": risk_level,
            "confidence": confidence,
            "analysis": self._generate_analysis(risk_level, engagement, quiz_score, weakest_topic),
            "factors": self._identify_risk_factors(engagement, quiz_score)
        }
    
    def _generate_analysis(self, risk_level: str, engagement: float, quiz_score: float, topic: str) -> str:
        """Generate human-readable analysis"""
        if risk_level == "High":
            return f"Student shows concerning patterns with {quiz_score}% quiz average and {engagement}% engagement. Priority intervention recommended for {topic}."
        elif risk_level == "Medium":
            return f"Student performing adequately but showing some weakness in {topic}. Consider targeted support to prevent further decline."
        else:
            return f"Student performing well overall. Continue monitoring and encourage advancement in challenging areas."
    
    def _identify_risk_factors(self, engagement: float, quiz_score: float) -> list:
        """Identify specific risk factors"""
        factors = []
        
        if quiz_score < 60:
            factors.append({"factor": "Low quiz performance", "severity": "high", "value": f"{quiz_score}%"})
        elif quiz_score < 75:
            factors.append({"factor": "Below average quiz scores", "severity": "medium", "value": f"{quiz_score}%"})
        
        if engagement < 50:
            factors.append({"factor": "Low engagement", "severity": "high", "value": f"{engagement}%"})
        elif engagement < 70:
            factors.append({"factor": "Moderate engagement", "severity": "medium", "value": f"{engagement}%"})
        
        return factors


class LearningPathService:
    """Generates personalized learning paths based on student needs"""
    
    def __init__(self):
        self.hf_service = HuggingFaceService()
        self.model_id = config.CHAT_MODEL_ID
    
    async def generate_learning_path(self, student_data: dict) -> dict:
        """Generate a personalized learning path for a student"""
        
        weakest_topic = student_data.get("weakestTopic", "Calculus - Derivatives")
        quiz_score = student_data.get("avgQuizScore", 50)
        engagement = student_data.get("engagementScore", 50)
        
        # Try API first, but have good fallback
        try:
            prompt = f"""Create a 5-step learning path for a student struggling with {weakest_topic}. 
Quiz average: {quiz_score}%, Engagement: {engagement}%.
List 5 steps with topic, type (video/quiz/exercise), and duration."""

            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 400,
                    "temperature": 0.7,
                    "do_sample": True
                }
            }
            
            # Use chat completion instead of raw model query
            messages = [{"role": "user", "content": payload["inputs"]}]
            result = await self.hf_service.query_chat(self.model_id, messages, max_tokens=400)
            
            if "error" not in result:
                # Parse and use if valid, otherwise fallback
                generated = result.get("generated_text", "")
                if len(generated) > 50:
                    return {
                        "generatedPath": True,
                        "steps": self._parse_generated_steps(generated, weakest_topic),
                        "summary": f"Personalized path for {weakest_topic}"
                    }
        except Exception:
            pass
        
        # Return curated fallback path
        return self._get_fallback_path(weakest_topic, quiz_score)
    
    def _parse_generated_steps(self, text: str, topic: str) -> list:
        """Parse generated text into structured steps"""
        # Try to extract steps from generated text, fallback if parsing fails
        steps = []
        
        # Simple parsing - look for numbered items
        lines = text.split('\n')
        step_num = 1
        
        for line in lines:
            if step_num > 5:
                break
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('-') or line.startswith('•')):
                steps.append({
                    "step": step_num,
                    "topic": line.lstrip('0123456789.-•) '),
                    "type": "video" if step_num <= 2 else "quiz" if step_num == 3 else "exercise",
                    "duration": f"{10 + step_num * 2} min"
                })
                step_num += 1
        
        # If parsing didn't work well, return fallback
        if len(steps) < 3:
            return self._get_fallback_path(topic, 50)["steps"]
        
        return steps
    
    def _get_fallback_path(self, topic: str, quiz_score: float) -> dict:
        """Get a curated fallback learning path"""
        
        # Topic-specific paths
        paths = {
            "derivatives": [
                {"step": 1, "topic": "Visual Introduction to Derivatives", "type": "video", "duration": "12 min"},
                {"step": 2, "topic": "Understanding Rate of Change", "type": "video", "duration": "10 min"},
                {"step": 3, "topic": "Basic Differentiation Rules Quiz", "type": "quiz", "duration": "15 min"},
                {"step": 4, "topic": "Chain Rule Practice", "type": "exercise", "duration": "20 min"},
                {"step": 5, "topic": "Comprehensive Derivatives Assessment", "type": "quiz", "duration": "25 min"}
            ],
            "quadratic": [
                {"step": 1, "topic": "Quadratic Functions Overview", "type": "video", "duration": "10 min"},
                {"step": 2, "topic": "Factoring Techniques", "type": "video", "duration": "12 min"},
                {"step": 3, "topic": "Quadratic Formula Practice", "type": "exercise", "duration": "15 min"},
                {"step": 4, "topic": "Graphing Parabolas", "type": "exercise", "duration": "18 min"},
                {"step": 5, "topic": "Quadratic Equations Mastery Quiz", "type": "quiz", "duration": "20 min"}
            ],
            "trigonometry": [
                {"step": 1, "topic": "Unit Circle Fundamentals", "type": "video", "duration": "15 min"},
                {"step": 2, "topic": "Sine, Cosine, Tangent Explained", "type": "video", "duration": "12 min"},
                {"step": 3, "topic": "Trig Ratios Practice", "type": "exercise", "duration": "15 min"},
                {"step": 4, "topic": "Trig Identities Introduction", "type": "video", "duration": "10 min"},
                {"step": 5, "topic": "Trigonometry Assessment", "type": "quiz", "duration": "20 min"}
            ],
            "default": [
                {"step": 1, "topic": f"Introduction to {topic}", "type": "video", "duration": "12 min"},
                {"step": 2, "topic": "Core Concepts Review", "type": "video", "duration": "10 min"},
                {"step": 3, "topic": "Fundamentals Check Quiz", "type": "quiz", "duration": "15 min"},
                {"step": 4, "topic": "Guided Practice Problems", "type": "exercise", "duration": "20 min"},
                {"step": 5, "topic": "Comprehensive Review", "type": "quiz", "duration": "25 min"}
            ]
        }
        
        # Match topic to path
        topic_lower = topic.lower()
        if "derivative" in topic_lower or "calculus" in topic_lower:
            steps = paths["derivatives"]
        elif "quadratic" in topic_lower or "algebra" in topic_lower:
            steps = paths["quadratic"]
        elif "trig" in topic_lower or "unit circle" in topic_lower:
            steps = paths["trigonometry"]
        else:
            steps = paths["default"]
        
        return {
            "generatedPath": False,
            "steps": steps,
            "summary": f"Remedial learning path for {topic}"
        }


class ClassAnalyticsService:
    """Provides AI-powered class-wide analytics and insights"""
    
    def __init__(self):
        self.hf_service = HuggingFaceService()
    
    async def generate_daily_insight(self, students: list) -> dict:
        """Generate a daily AI insight based on class performance"""
        
        # Calculate class statistics
        total_students = len(students)
        if total_students == 0:
            return {"insight": "No student data available.", "trends": []}
        
        avg_engagement = sum(s.get("engagementScore", 0) for s in students) / total_students
        avg_quiz = sum(s.get("avgQuizScore", 0) for s in students) / total_students
        high_risk = sum(1 for s in students if s.get("riskLevel") == "High")
        
        # Find struggling topics
        topic_counts = {}
        for s in students:
            topic = s.get("weakestTopic", "Unknown")
            topic_counts[topic] = topic_counts.get(topic, 0) + 1
        
        most_common_weakness = max(topic_counts.items(), key=lambda x: x[1])[0] if topic_counts else "Unknown"
        
        # Generate insight
        if high_risk > total_students * 0.3:
            insight = f"⚠️ Alert: {high_risk} students ({round(high_risk/total_students*100)}%) are at high risk. Most are struggling with {most_common_weakness}. Consider a class review session."
        elif avg_engagement < 60:
            insight = f"📊 Class engagement is at {round(avg_engagement)}%. Consider interactive activities to boost participation."
        elif avg_quiz > 80:
            insight = f"🎉 Great news! Class average is {round(avg_quiz)}%. Students are excelling - consider introducing advanced topics."
        else:
            insight = f"📈 Class is performing steadily with {round(avg_quiz)}% average. Focus area: {most_common_weakness} ({topic_counts.get(most_common_weakness, 0)} students struggling)."
        
        trends = [
            {"metric": "Class Average", "value": f"{round(avg_quiz)}%", "trend": "up" if avg_quiz > 70 else "down"},
            {"metric": "Engagement", "value": f"{round(avg_engagement)}%", "trend": "up" if avg_engagement > 65 else "down"},
            {"metric": "At Risk", "value": f"{high_risk} students", "trend": "down" if high_risk < 3 else "up"}
        ]
        
        return {
            "insight": insight,
            "trends": trends,
            "focusTopic": most_common_weakness,
            "recommendations": self._generate_recommendations(avg_quiz, avg_engagement, high_risk)
        }
    
    def _generate_recommendations(self, avg_quiz: float, avg_engagement: float, high_risk: int) -> list:
        """Generate actionable recommendations"""
        recs = []
        
        if high_risk > 2:
            recs.append({
                "priority": "high",
                "action": "Schedule one-on-one sessions with high-risk students",
                "impact": "Direct intervention for struggling students"
            })
        
        if avg_engagement < 60:
            recs.append({
                "priority": "medium",
                "action": "Introduce gamified learning activities",
                "impact": "Boost engagement through interactive content"
            })
        
        if avg_quiz < 70:
            recs.append({
                "priority": "medium",
                "action": "Review foundational concepts as a class",
                "impact": "Strengthen baseline understanding"
            })
        
        return recs
