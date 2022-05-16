attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal; //法向量
uniform mat4 u_MvpMatrix;
uniform vec3 u_LightColor;//光线颜色
uniform vec3 u_LightDirection;  //归一化的世界坐标
uniform vec3 u_AmbientLight; //环境光颜色
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(a_Normal));
    float nDotL = max(dot(u_LightDirection, normal), 0.0);  //计算光线方向和法向量的电积
    vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;  //计算漫反射光的颜色
    vec3 ambient = u_AmbientLight * a_Color.rgb; //计算环境光产生的反射光颜色
    v_Color = vec4(diffuse + ambient, a_Color.a);
}