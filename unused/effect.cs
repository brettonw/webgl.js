using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;


namespace Models
{
    public class WrappedEffect : Effect, IEffectMatrices
    {
        Matrix world = Matrix.Identity;
        Matrix view = Matrix.Identity;
        Matrix projection = Matrix.Identity;

        EffectParameter worldParam;
        EffectParameter worldViewProjParam;
        EffectParameter worldInverseTransposeParam;
        EffectParameter cameraPositionParam;
        EffectParameter directionalLight0DirectionParam;
        EffectParameter directionalLight0ColorParam;

        public WrappedEffect(Effect wrappedEffect) : base(wrappedEffect)
        {
            worldParam = Parameters["World"];
            worldViewProjParam = Parameters["WorldViewProj"];
            worldInverseTransposeParam = Parameters["WorldInverseTranspose"];
            cameraPositionParam = Parameters["CameraPosition"];
            directionalLight0DirectionParam = Parameters["DirectionalLight0Direction"];
            directionalLight0ColorParam = Parameters["DirectionalLight0Color"];
        }

        public Matrix Projection
        {
            get { return projection; }
            set { projection = value; }
        }

        public Matrix View
        {
            get { return view; }
            set { view = value; }
        }

        public Matrix World
        {
            get { return world; }
            set { world = value; }
        }

        public Vector3 DirectionalLight0Direction { get; set; }
        public Vector3 DirectionalLight0Color { get; set; }

        protected override bool OnApply()
        {
            // more or less replicated from Monogame BasicEffect
            Matrix worldView;
            Matrix worldViewProj;
            Matrix.Multiply(ref world, ref view, out worldView);
            Matrix.Multiply(ref worldView, ref projection, out worldViewProj);
            worldViewProjParam.SetValue(worldViewProj);

            // if the effect wants the world matrix, supply it
            if (worldParam != null)
            {
                worldParam.SetValue(world);
            }

            // if the world inverse transpose is needed (for lighting)
            if (worldInverseTransposeParam != null)
            {
                Matrix worldTranspose;
                Matrix worldInverseTranspose;

                Matrix.Invert(ref world, out worldTranspose);
                Matrix.Transpose(ref worldTranspose, out worldInverseTranspose);

                worldParam.SetValue(world);
                worldInverseTransposeParam.SetValue(worldInverseTranspose);
            }


            // set up the camera position, if it's wanted
            if (cameraPositionParam != null)
            {
                var cameraPosition = Matrix.Invert(view).Translation;
                cameraPositionParam.SetValue(cameraPosition);
            }

            // we don't need to separate the diffuse and specular colors
            directionalLight0DirectionParam.SetValue(DirectionalLight0Direction);
            directionalLight0ColorParam.SetValue(DirectionalLight0Color);

            return false;
        }
    }
}
